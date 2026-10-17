import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { importPKCS8, SignJWT } from 'jose';
import { EpicTokenResponseSchema } from '../schemas/epicAuth.js';

const EPIC_TOKEN_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';

export async function createClientAssertion(): Promise<string> {
  const clientId = process.env.EPIC_CLIENT_ID;

  if (!clientId) {
    throw new Error('EPIC_CLIENT_ID is not configured.');
  }

  const privateKeyPath = new URL('../../keys/private.pem', import.meta.url);
  const privateKeyPem = await readFile(privateKeyPath, 'utf8');
  const privateKey = await importPKCS8(privateKeyPem, 'RS384');

  return new SignJWT({})
    .setProtectedHeader({
      alg: 'RS384',
      kid: 'epic-sandbox-key-1',
      typ: 'JWT',
    })
    .setIssuer(clientId)
    .setSubject(clientId)
    .setAudience(EPIC_TOKEN_URL)
    .setJti(randomUUID())
    .setIssuedAt()
    .setExpirationTime('5m')
    .sign(privateKey);
}

export async function getEpicAccessToken(): Promise<string> {
  const clientAssertion = await createClientAssertion();

  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: clientAssertion,
    scope: 'system/Patient.rs',
  });

  const response = await fetch(EPIC_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    throw new Error(`Epic OAuth failed (${response.status}): ${await response.text()}`);
  }

  const data = EpicTokenResponseSchema.parse(await response.json());

  return data.access_token;
}
