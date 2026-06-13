import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Env } from "./config/ENV.config.js";
import { HTTPSTATUS } from './config/http.config.js';
import connectDatabase from './config/db.config.js'
import { errorHandler } from './middlewares/errorHandler.middleware.js'
import authRoutes from './routes/auth.routes.js'
import courseRoutes from './routes/course.routes.js'
import transactionRoutes from './routes/transaction.routes.js'
import instructorRoutes from './routes/instructor.routes.js'
import studentRoutes from './routes/student.routes.js'
import commentRoutes from './routes/comment.routes.js'
import { asyncHandler } from './middlewares/asyncHandler.middleware.js'


const app = express()

//middlewares
app.use((req, res, next) => {
    const origin = req.header.origin;

    if (origin === Env.FRONTEND_ORIGIN) {
        res.header('Access-Control-Allow-Credentials', true);
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    }


    next();
});
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: Env.FRONTEND_ORIGIN,
        credentials: true,
    })
);
app.use((req, res, next) => {
    setTimeout(() => {
        next()
    }, 1500);
})
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
app.use('/api/auth', authRoutes)
app.use('/api/course', courseRoutes)
app.use('/api/transaction', transactionRoutes)
app.use('/api/instructor', instructorRoutes)
app.use('/api/student', studentRoutes)
app.use('/api/comment', commentRoutes)


app.all('/*splat', (req, res) => {
    res.status(HTTPSTATUS.NOT_FOUND).json({ message: '404 not found' })
})


if (Env.NODE_ENV === "production") {
    const clientPath = path.resolve(__dirname, "../../frontend/dist");

    //Serve static files
    app.use(express.static(clientPath));

    app.get(/^(?!\/api).*/, (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
    });
}

app.use(errorHandler);


app.listen(Env.PORT, async () => {
    await connectDatabase();
    console.log(`Server running on port ${Env.PORT} in ${Env.NODE_ENV} mode`);
});
