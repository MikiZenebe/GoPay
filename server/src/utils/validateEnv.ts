import { cleanEnv } from "envalid";
import { config } from "dotenv";
import { str } from "envalid/dist/validators";
config();

const env = cleanEnv(process.env, {
  MONGO_URI: str(),
  JWT_SECRET: str(),
  FRONTEND_URL: str(),
});

export default env;
