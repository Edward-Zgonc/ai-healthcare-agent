import { z } from 'zod';

export const FhirPatientSchema = z.looseObject({
  resourceType: z.literal('Patient'),
  id: z.string(),
  active: z.boolean().optional(),
  name: z
    .array(
      z.looseObject({
        use: z.string().optional(),
        text: z.string().optional(),
        family: z.string().optional(),
        given: z.array(z.string()).optional(),
      })
    )
    .optional(),
  gender: z.enum(['male', 'female', 'other', 'unknown']).optional(),
  birthDate: z.string().optional(),
  deceasedBoolean: z.boolean().optional(),
});

export const FhirOperationOutcomeSchema = z.looseObject({
  resourceType: z.literal('OperationOutcome'),
  issue: z.array(
    z.looseObject({
      severity: z.string(),
      code: z.string(),
    })
  ),
});

export const FhirPatientSearchBundleSchema = z.looseObject({
  resourceType: z.literal('Bundle'),
  type: z.literal('searchset'),
  total: z.number().int().nonnegative().optional(),
  link: z
    .array(
      z.looseObject({
        relation: z.string(),
        url: z.string(),
      })
    )
    .optional(),
  entry: z
    .array(
      z.looseObject({
        fullUrl: z.string().optional(),
        resource: z.discriminatedUnion('resourceType', [
          FhirPatientSchema,
          FhirOperationOutcomeSchema,
        ]),
        search: z
          .looseObject({
            mode: z.enum(['match', 'include', 'outcome']),
          })
          .optional(),
      })
    )
    .optional(),
});

export type FhirPatient = z.infer<typeof FhirPatientSchema>;
export type FhirOperationOutcome = z.infer<typeof FhirOperationOutcomeSchema>;
export type FhirPatientSearchBundle = z.infer<typeof FhirPatientSearchBundleSchema>;
