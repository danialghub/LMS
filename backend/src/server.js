//libs
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path';
import fs from 'fs';
import dns from 'dns';
//configs
import { Env } from "./config/ENV.config.js";
import { HTTPSTATUS } from './config/http.config.js';
import connectDatabase from './config/db.config.js'
//middlewares
import { errorHandler } from './middlewares/errorHandler.middleware.js'
import { asyncHandler } from './middlewares/asyncHandler.middleware.js'
//routes
import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/course.routes.js'
import transactionRoutes from './routes/transaction.routes.js'
import instructorRoutes from './routes/instructor.routes.js'
import studentRoutes from './routes/student.routes.js'
import commentRoutes from './routes/comment.routes.js'
import siteMapRoute from './routes/siteMap.routes.js'

dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express()

//middlewares
app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin === Env.FRONTEND_ORIGIN) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }


    next();
});
// app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: Env.FRONTEND_ORIGIN,
        credentials: true,
    })
);

//APIs
app.get(
    "/test",
    asyncHandler(async (req, res) => {
        res.status(HTTPSTATUS.OK).json({
            message: "Server is healthy",
            status: "OK",
        });
    })
);
app.use('/sitemap.xml', siteMapRoute)
app.use('/api/auth', authRoutes)
app.use('/api/course', courseRoutes)
app.use('/api/transaction', transactionRoutes)
app.use('/api/instructor', instructorRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/comment', commentRoutes)


if (Env.NODE_ENV === "production") {
    const publicDir = path.join(process.cwd(), "public")

    if (!fs.existsSync(publicDir)) {
        console.error(`Client build not found at ${clientPath}`);
        process.exit(1);
    }

    app.use(express.static(publicDir));

    app.get("/*splat", (req, res, next) => {  // ✅ next اضافه شد
        if (req.path.startsWith("/api")) {
            return next();
        }
        res.sendFile(path.join(publicDir, "index.html"), (err) => {
            if (err) next(err);
        });
    });
} else {
    app.all('/*splat', (req, res) => {
        res.status(HTTPSTATUS.NOT_FOUND).json({ message: '404 not found' })
    })
}


app.use(errorHandler);


app.listen(Env.PORT, async () => {
    await connectDatabase();
    console.log(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
