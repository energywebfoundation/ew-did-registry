import Joi from 'joi';
import { IPresentationDefinition } from '@sphereon/pex';
import {
  PresentationDefinitionV1,
  PresentationDefinitionV2,
} from '@sphereon/pex-models';
import { CredentialSubject } from './credentials.types';
import {
  ContinueExchangeCredentials,
  ContinueExchangeSelections,
  VpRequest,
} from './exchange.types';
import { isVerifiableCredential } from './credential.utils';

const isValidObject = (obj: unknown, validator: Joi.ObjectSchema): boolean => {
  return !validator.validate(obj).error;
};

const JwtObjectSchema = Joi.object({
  alg: Joi.array().items(Joi.string()).required(),
});
const LdpObjectSchema = Joi.object({
  proof_type: Joi.array().items(Joi.string()).required(),
});

const defaultPresentationDefinitionSchema = {
  id: Joi.string().required(),
  name: Joi.string().optional(),
  purpose: Joi.string().optional(),
  format: Joi.object({
    jwt: JwtObjectSchema.optional(),
    jwt_vc: JwtObjectSchema.optional(),
    jwt_vp: JwtObjectSchema.optional(),
    ldp: LdpObjectSchema.optional(),
    ldp_vc: LdpObjectSchema.optional(),
    ldp_vp: LdpObjectSchema.optional(),
  }).optional(),
  submission_requirements: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().optional(),
        purpose: Joi.string().optional(),
        rule: Joi.string().valid('all', 'pick').required(),
        count: Joi.number().optional(),
        min: Joi.number().optional(),
        max: Joi.number().optional(),
        from: Joi.string().optional(),
        from_nested: Joi.array().items(Joi.any()).optional(),
      })
    )
    .optional(),
};

export function isPresentationDefinitionV1(
  presentationDefinition: unknown
): presentationDefinition is PresentationDefinitionV1 {
  const OptionalitySchema = Joi.string().valid('required', 'preferred');
  const PdStatusSchema = Joi.object({
    directive: Joi.string()
      .valid('required', 'allowed', 'disallowed')
      .required(),
  });
  const HolderSubjectSchema = Joi.object({
    field_id: Joi.array().items(Joi.string()).required(),
    directive: OptionalitySchema.required(),
  });
  const NumberStringNullSchema = Joi.alternatives(
    Joi.number(),
    Joi.string().allow(null)
  );

  const validator = Joi.object({
    ...defaultPresentationDefinitionSchema,
    input_descriptors: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().optional(),
          purpose: Joi.string().optional(),
          group: Joi.array().items(Joi.string()).optional(),
          schema: Joi.array()
            .items(
              Joi.object({
                uri: Joi.string().required(),
                required: Joi.boolean().optional(),
              })
            )
            .optional(),
          constraints: Joi.object({
            limit_disclosure: OptionalitySchema.optional(),
            statuses: Joi.array()
              .items(
                Joi.object({
                  active: PdStatusSchema.optional(),
                  suspended: PdStatusSchema.optional(),
                  revoked: PdStatusSchema.optional(),
                })
              )
              .optional(),
            fields: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().optional(),
                  path: Joi.array().items(Joi.string()).optional(),
                  purpose: Joi.string().optional(),
                  filter: Joi.object({
                    _const: NumberStringNullSchema.optional(),
                    _enum: Joi.array()
                      .items(Joi.alternatives(Joi.string(), Joi.number()))
                      .optional(),
                    const: NumberStringNullSchema.optional(),
                    enum: Joi.array()
                      .items(Joi.alternatives(Joi.string(), Joi.number()))
                      .optional(),
                    exclusiveMinimum: NumberStringNullSchema.optional(),
                    exclusiveMaximum: NumberStringNullSchema.optional(),
                    format: Joi.string().optional(),
                    minLength: Joi.number().optional(),
                    maxLength: Joi.number().optional(),
                    minimum: NumberStringNullSchema.optional(),
                    maximum: NumberStringNullSchema.optional(),
                    not: Joi.object().keys().unknown(true).optional(),
                    pattern: Joi.string().optional(),
                    type: Joi.string().required(),
                  }).optional(),
                  predicate: OptionalitySchema.optional(),
                })
              )
              .optional(),
            subject_is_issuer: OptionalitySchema.optional(),
            is_holder: Joi.array().items(HolderSubjectSchema).optional(),
            same_subject: Joi.array().items(HolderSubjectSchema).optional(),
          }).optional(),
        })
      )
      .optional(),
  });

  return isValidObject(presentationDefinition, validator);
}

export function isPresentationDefinitionV2(
  presentationDefinition: unknown
): presentationDefinition is PresentationDefinitionV2 {
  const OptionalitySchema = Joi.string().valid('required', 'preferred');
  const PdStatusSchema = Joi.object({
    directive: Joi.string()
      .valid('required', 'allowed', 'disallowed')
      .required(),
  });
  const HolderSubjectSchema = Joi.object({
    field_id: Joi.array().items(Joi.string()).required(),
    directive: OptionalitySchema.required(),
  });
  const NumberStringNullSchema = Joi.alternatives(
    Joi.number(),
    Joi.string().allow(null)
  );

  const validator = Joi.object({
    ...defaultPresentationDefinitionSchema,
    input_descriptors: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          name: Joi.string().optional(),
          purpose: Joi.string().optional(),
          group: Joi.array().items(Joi.string()).optional(),
          constraints: Joi.object({
            limit_disclosure: OptionalitySchema.optional(),
            statuses: Joi.array()
              .items(
                Joi.object({
                  active: PdStatusSchema.optional(),
                  suspended: PdStatusSchema.optional(),
                  revoked: PdStatusSchema.optional(),
                })
              )
              .optional(),
            fields: Joi.array()
              .items(
                Joi.object({
                  id: Joi.string().optional(),
                  path: Joi.array().items(Joi.string()).optional(),
                  purpose: Joi.string().optional(),
                  filter: Joi.object({
                    _const: NumberStringNullSchema.optional(),
                    const: NumberStringNullSchema.optional(),
                    _enum: Joi.array()
                      .items(Joi.alternatives(Joi.string(), Joi.number()))
                      .optional(),
                    enum: Joi.array()
                      .items(Joi.alternatives(Joi.string(), Joi.number()))
                      .optional(),
                    exclusiveMinimum: NumberStringNullSchema.optional(),
                    exclusiveMaximum: NumberStringNullSchema.optional(),
                    format: Joi.string().optional(),
                    formatMaximum: Joi.string().optional(),
                    formatMinimum: Joi.string().optional(),
                    formatExclusiveMaximum: Joi.string().optional(),
                    formatExclusiveMinimum: Joi.string().optional(),
                    minLength: Joi.number().optional(),
                    maxLength: Joi.number().optional(),
                    minimum: NumberStringNullSchema.optional(),
                    maximum: NumberStringNullSchema.optional(),
                    not: Joi.object().keys().unknown(true).optional(),
                    pattern: Joi.string().optional(),
                    type: Joi.string().required(),
                  }).optional(),
                  predicate: OptionalitySchema.optional(),
                })
              )
              .optional(),
            subject_is_issuer: OptionalitySchema.optional(),
            is_holder: Joi.array().items(HolderSubjectSchema).optional(),
            same_subject: Joi.array().items(HolderSubjectSchema).optional(),
          }).optional(),
        })
      )
      .optional(),
    frame: Joi.object().keys().unknown(true).optional(),
  });

  return isValidObject(presentationDefinition, validator);
}

export function isPresentationDefinition(
  presentationDefinition: unknown
): presentationDefinition is IPresentationDefinition {
  return (
    isPresentationDefinitionV1(presentationDefinition) ||
    isPresentationDefinitionV2(presentationDefinition)
  );
}

export function isVpRequest(request: unknown): request is VpRequest {
  const validator = Joi.object({
    challenge: Joi.string().required(),
    query: Joi.array()
      .items(
        Joi.object({
          type: Joi.string()
            .valid('DIDAuth', 'PresentationDefinition')
            .required(),
          credentialQuery: Joi.array()
            .items(
              Joi.object({
                presentationDefinition: Joi.custom((value, helpers) => {
                  return isPresentationDefinition(value)
                    ? true
                    : helpers.error('must be a presentation definition');
                }).optional(),
              }).unknown(true)
            )
            .required(),
        })
      )
      .required(),
    interact: Joi.object({
      service: Joi.array()
        .items(
          Joi.object({
            type: Joi.string()
              .valid(
                'UnmediatedHttpPresentationService2021',
                'MediatedHttpPresentationService2021'
              )
              .required(),
            serviceEndpoint: Joi.string().required(),
          })
        )
        .required(),
    }).required(),
  });

  return isValidObject(request, validator);
}

export function isContinueExchangeSelections(
  value: unknown
): value is ContinueExchangeSelections {
  const StatusSchema = Joi.string().valid('info', 'warn', 'error');
  const CheckedSchema = Joi.object({
    tag: Joi.string().required(),
    status: StatusSchema.required(),
    message: Joi.string().optional(),
  });
  const validator = Joi.object({
    vpRequest: Joi.custom((value, helpers) => {
      return isVpRequest(value) ? true : helpers.error('must be a vp request');
    }).required(),
    selections: Joi.array()
      .items(
        Joi.object({
          presentationDefinition: Joi.custom((value, helpers) => {
            return isPresentationDefinition(value)
              ? true
              : helpers.error('must be a presentation definition');
          }).required(),
          selectResults: Joi.object({
            errors: Joi.array().items(CheckedSchema).optional(),
            matches: Joi.array()
              .items(
                Joi.object({
                  name: Joi.string().optional(),
                  rule: Joi.string().valid('all', 'pick').required(),
                  count: Joi.number().optional(),
                  min: Joi.number().optional(),
                  max: Joi.number().optional(),
                  from: Joi.string().optional(),
                  from_nested: Joi.array().items(Joi.any()).optional(),
                  vc_path: Joi.array().items(Joi.string()).required(),
                })
              )
              .optional(),
            areRequiredCredentialsPresent: StatusSchema.required(),
            verifiableCredential: Joi.array()
              .items(
                Joi.custom((value, helper) => {
                  return isVerifiableCredential(value)
                    ? true
                    : helper.error('must be a verifiable credential');
                })
              )
              .optional(),
            vcIndexes: Joi.array().items(Joi.number()).optional(),
            warnings: Joi.array().items(CheckedSchema).optional(),
          }).required(),
        })
      )
      .required(),
  });

  return isValidObject(value, validator);
}

export function isContinueExchangeCredentials(
  value: unknown
): value is ContinueExchangeCredentials<CredentialSubject> {
  const validator = Joi.object({
    vpRequest: Joi.custom((value, helpers) => {
      return isVpRequest(value) ? true : helpers.error('must be a vp request');
    }).required(),
    credentials: Joi.array()
      .items(
        Joi.custom((value, helpers) => {
          return isVerifiableCredential(value)
            ? true
            : helpers.error('must be a verifiable credential');
        })
      )
      .required(),
  });

  return isValidObject(value, validator);
}
