import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  BETTER_AUTH_SECRET: Joi.string().min(32).required(),
  BETTER_AUTH_URL: Joi.string().uri().required(),
  FRONTEND_URL: Joi.string().uri().required(),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
});
