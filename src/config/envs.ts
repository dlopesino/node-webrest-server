import 'dotenv/config'
import { get } from 'env-var';

export const envs = {
    PORT: get('PORT').required().asPortNumber(),
    PUBLIC_FOLDER: get('PUBLIC_PATH').default('public').asString(),
    POSTGRES_URL: get('POSTGRES_URL').asString(),
}