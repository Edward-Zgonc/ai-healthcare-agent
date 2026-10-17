import { getEpicAccessToken } from './epicAuth.js';
import { FhirPatientSearchBundleSchema } from '../schemas/fhir.js';
import { PatientSearchParamsSchema, type PatientSearchParams } from '../schemas/patientSearch.js';

const EPIC_FHIR_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';

export async function searchPatients(params: PatientSearchParams) {
  const validatedParams = PatientSearchParamsSchema.parse(params);
  const url = new URL(`${EPIC_FHIR_BASE_URL}/Patient`);

  for (const [key, value] of Object.entries(validatedParams)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  if (url.searchParams.size === 0) {
    throw new Error('At least one patient search parameter is required.');
  }

  const accessToken = await getEpicAccessToken();

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
    },
  });

  if (!response.ok) {
    throw new Error(`Epic FHIR request failed (${response.status}): ${await response.text()}`);
  }

  return FhirPatientSearchBundleSchema.parse(await response.json());
}
