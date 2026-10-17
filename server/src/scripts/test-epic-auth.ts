import 'dotenv/config';
import { getEpicAccessToken } from '../services/epicAuth.js';

try {
  const accessToken = await getEpicAccessToken();

  console.log('Epic authentication successful!');
  console.log('Access token received:', accessToken.length > 0);
} catch (error) {
  console.error('Epic authentication failed:', error);
  process.exitCode = 1;
}
