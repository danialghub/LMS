import 'dotenv/config'

export const Env = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || "DL#FOSJFIJFIS",
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || "http://localhost:5173",

};
