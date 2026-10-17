import 'dotenv/config';
import { searchPatients } from '../services/epicFhir.js';

try {
  const result = await searchPatients({
    given: 'Allison',
    family: 'Mychart',
    gender: 'female',
    address: '123 Main St.',
    'address-city': 'Madison',
    'address-state': 'Wisconsin',
    'address-postalcode': '53703',
    telecom: '608-123-4567',
  });

  console.dir(result, { depth: null });
} catch (error) {
  console.error('Epic FHIR request failed:', error);
  process.exitCode = 1;
}
