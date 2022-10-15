import { cleanEnv, str, port } from 'envalid';

export default function validateEnv(): void {
  cleanEnv(process.env, {
    NODE_ENV: str({
      choices: ['development', 'production'],
    }),
    MONGO_URI: str(),
    JWT_SECRET: str(),
    PORT: port({ default: 3000 }),
  });
}
