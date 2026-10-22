import { readFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { importPKCS8, SignJWT } from 'jose';
import { EpicTokenResponseSchema } from '../schemas/epicAuth.js';
import AppError from '../errors/AppError.js';

const EPIC_TOKEN_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/oauth2/token';

export async function createClientAssertion(): Promise<string> {
  const clientId = process.env.EPIC_CLIENT_ID;

  if (!clientId) {
    throw new AppError('Epic authentication configuration error', 500, {
      log: 'epicAuth.createClientAssertion: EPIC_CLIENT_ID is not configured',
    });
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

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;
let pendingTokenRequest: Promise<string> | null = null;

/* This handles concurrent token requests by first checking for a valid cached token. If another authentication request is already in progress, reuse its Promise rather than sending a duplicate request to Epic. Otherwise, start a new request. The finally block clears the pending Promise once it settles, preventing future calls from reusing a resolved Promise that could contain an expired token. One additional benefit: The finally block also clears the Promise if authentication fails, allowing subsequent calls to retry. */
export async function getEpicAccessToken(): Promise<string> {
  // Return the cached token if it's still valid.

  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  // Reuse an authentication request already in progress.

  if (pendingTokenRequest) {
    return pendingTokenRequest;
  }

  // Start a new authentication request and store its Promise.

  pendingTokenRequest = requestNewAccessToken();

  try {
    return await pendingTokenRequest;
  } finally {
    pendingTokenRequest = null;
  }
}

async function requestNewAccessToken(): Promise<string> {
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
    throw new AppError('Unable to authenticate with Epic', 502, {
      log: `epicAuth.requestNewAccessToken: Epic returned HTTP ${response.status}`,
    });
  }

  const data = EpicTokenResponseSchema.parse(await response.json());

  console.log('Epic access token expires in:', data.expires_in, 'seconds');
  // Cache the token until 60 seconds before expiration.
  cachedAccessToken = data.access_token;
  tokenExpiresAt = Date.now() + Math.max(0, (data.expires_in ?? 0) - 60) * 1000;
  return cachedAccessToken;
}
