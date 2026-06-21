import express from 'express'
import Course from '../Models/Course.js'
import { Env } from '../config/ENV.config.js';
import { asyncHandler } from '../middlewares/asyncHandler.middleware.js';

const router = express.Router()

router.get('/', asyncHandler(
    async (req, res) => {

        const courses = await Course.find();

        const staticUrls = [
            "",
            "/courses",
        ];

        const staticXml = staticUrls.map(url => `
            <url>
                <loc>${Env.FRONTEND_ORIGIN}${url ? '/' + url : ''}</loc>
                <changefreq>daily</changefreq>
                <priority>${url === "" ? "1.0" : "0.9"}</priority>
            </url>
        `).join("");

        const courseXml = courses.map(course => `
            <url>
                <loc>${Env.FRONTEND_ORIGIN}/course/${course.slug}</loc>
                <changefreq>daily</changefreq>
                <priority>0.7</priority>
            </url>
        `).join("");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
            <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
                ${staticXml}
                ${courseXml}
            </urlset>`;

        res.header("Content-Type", "application/xml");
        res.send(xml);

    }
));

export default router