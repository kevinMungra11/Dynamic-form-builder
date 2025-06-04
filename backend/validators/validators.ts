import Joi from "joi";

export const submissionValidationSchema = Joi.object({
  _id: Joi.string(),
  formId: Joi.string(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  responses: Joi.object()
    .pattern(Joi.string(), Joi.alternatives().try(Joi.string(), Joi.boolean()))
    .required(),
});

export const fieldValidationSchema = Joi.object({
  _id: Joi.string(),
  label: Joi.string().required(),
  type: Joi.string().valid("text", "checkbox").required(),
  required: Joi.boolean().default(false),
});

export const formValidationSchema = Joi.object({
  _id: Joi.string(),
  title: Joi.string().required(),
  fields: Joi.array().items(fieldValidationSchema).min(1).required(),
});
