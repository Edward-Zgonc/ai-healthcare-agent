import { readFile, writeFile } from 'node:fs/promises';
import { createPublicKey } from 'node:crypto';
import { exportJWK } from 'jose';

const publicKeyPath = new URL('../../keys/public.pem', import.meta.url);
const publicKeyPem = await readFile(publicKeyPath, 'utf8');
const publicKey = createPublicKey(publicKeyPem); // Node.js KeyObject
const jwk = await exportJWK(publicKey);
jwk.kid = 'epic-sandbox-key-1';
jwk.alg = 'RS384';
jwk.use = 'sig';
const jwks = {
  keys: [jwk],
};
const jwksPath = new URL('../../keys/jwks.json', import.meta.url);
await writeFile(jwksPath, JSON.stringify(jwks, null, 2), 'utf8');
console.log('JWKS generated successfully.');
