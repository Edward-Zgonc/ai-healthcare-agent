import { z } from 'zod';

export const PatientSearchParamsSchema = z
  .object({
    given: z.string().describe('first name').optional(),
    family: z.string().describe('last name (surname)').optional(),
    gender: z.string().optional(),
    birthdate: z.iso.date().describe('Date of birth in YYYY-MM-DD format.').optional(),
    identifier: z
      .string()
      .describe('Patient identifier; accepts identifier or system|identifier.')
      .optional(),
    name: z.string().optional(),
    address: z.string().optional(),
    'address-city': z.string().optional(),
    'address-state': z.string().optional(),
    'address-postalcode': z.string().optional(),
    telecom: z.string().optional(),
    'legal-sex': z.string().optional(),
    'own-name': z.string().optional(),
    'own-prefix': z.string().optional(),
    'partner-name': z.string().optional(),
    'partner-prefix': z.string().optional(),
    _count: z.number().int().positive().optional(),
    _id: z.string().optional(),
    _include: z.string().optional(),
    _revinclude: z.string().optional(),
    active: z.boolean().optional(),
    'address-use': z.string().optional(),
    'death-date': z.string().optional(),
    email: z.string().optional(),
    'general-practitioner': z.string().optional(),
    language: z.string().optional(),
    link: z.string().optional(),
    organization: z.string().optional(),
    phone: z.string().optional(),
  })
  .refine(
    (params) =>
      Boolean(
        params.identifier ||
        (params.given && params.family && params.birthdate) ||
        (params.given && params.family && params['legal-sex'] && (params.phone || params.email))
      ),

    {
      message:
        'Invalid patient search parameters. Provide an identifier, ' +
        'given + family + birthdate, or given + family + legal-sex + (phone or email).',
    }
  );

export type PatientSearchParams = z.infer<typeof PatientSearchParamsSchema>;
