import 'dotenv/config';
import  * as joi from 'joi'

interface EnvVars {
    NATS_SERVERS: string[];
}

const envVarsSchema = joi.object({
    NATS_SERVERS: joi.array().items(joi.string()).required()
}).unknown(true)

const { error, value } =
 envVarsSchema.validate({
    ...process.env,
    NATS_SERVERS: process.env.NATS_SERVERS.split(',')
 });

 if (error) {
     throw new Error(`Config validation error: ${error.message}`)
 }

const envVars: EnvVars = value;

export const envs ={
    NATS_SERVERS: envVars.NATS_SERVERS
}