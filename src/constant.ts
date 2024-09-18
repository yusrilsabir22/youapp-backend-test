import {config} from 'dotenv'
config()

export const jwtConstants = {
    secret: process.env.JWT_SECRET,
};

export const dbConfig = {
    url: process.env.DATABASE_URL,
    appName: process.env.DATABASE_APP_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
};
