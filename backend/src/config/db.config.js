import mongoose from "mongoose";
import { Env } from "./ENV.config.js";

const connectDatabase = async () => {
    try {
        await mongoose.connect(`${Env.MONGO_URI}/LMS`);
        console.log("Database connected");
    } catch (error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
};

export default connectDatabase;
