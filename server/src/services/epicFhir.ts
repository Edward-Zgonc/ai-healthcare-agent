import { getEpicAccessToken } from './epicAuth.js';
import { FhirPatientSearchBundleSchema } from '../schemas/fhir.js';
import { PatientSearchParamsSchema, type PatientSearchParams } from '../schemas/patientSearch.js';
import AppError from '../errors/AppError.js';

const EPIC_FHIR_BASE_URL = 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';

export async function searchPatients(params: PatientSearchParams) {
  const validatedParams = PatientSearchParamsSchema.parse(params);
  const url = new URL(`${EPIC_FHIR_BASE_URL}/Patient/_search`);

  const body = new URLSearchParams();

  for (const [key, value] of Object.entries(validatedParams)) {
    if (value !== undefined) {
      body.set(key, String(value));
    }
  }

  if (body.size === 0) {
    throw new AppError('At least one patient search parameter is required.', 400, {
      log: 'epicFhir.searchPatients: No search parameters provided',
    });
  }

  const accessToken = await getEpicAccessToken();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/fhir+json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  if (!response.ok) {
    throw new AppError('Unable to retrieve patient information', 502, {
      log: `epicFhir.searchPatients: Epic returned HTTP ${response.status}`,
    });
  }

  return FhirPatientSearchBundleSchema.parse(await response.json());
}
