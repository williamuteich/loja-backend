import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'test', 'production').default('development'),
  JWT_SECRET: Joi.string().required(),
  JWT_TEAM_EXPIRES_IN: Joi.string().default('1h'),
  DATABASE_URL: Joi.string().required(),
});
