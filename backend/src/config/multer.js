import multer from 'multer';
// import path from 'path';
// import fs from 'fs'

// const ensureDirectoryExists = (directory) => {
//     if (!fs.existsSync(directory)) {
//         fs.mkdirSync(directory, { recursive: true });
//     }
// };

// // تنظیم ذخیره‌سازی
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         let uploadPath;

//         if (file.mimetype.startsWith('image/')) {
//             uploadPath = 'uploads/thumbnails/';
//         } else if (file.mimetype.startsWith('video/')) {
//             uploadPath = 'uploads/videos/';
//         } else if (
//             file.mimetype === 'application/zip' ||
//             file.mimetype === 'application/x-zip-compressed' ||
//             file.mimetype === 'application/x-rar-compressed' ||
//             file.mimetype === 'application/x-tar' ||
//             file.mimetype === 'application/x-7z-compressed'
//         ) {
//             uploadPath = 'uploads/attachments/';
//         } else {
//             uploadPath = 'uploads/attachments/'; 
//         }

//         // اطمینان از وجود پوشه
//         ensureDirectoryExists(uploadPath);

//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
//         cb(null, file.fieldname + '-' + uniqueName + ext);
//     }
// });

// // فیلتر برای اعتبارسنجی نوع فایل
// const fileFilter = (req, file, cb) => {

//     if (file.mimetype.startsWith('image/')) {
//         cb(null, true);
//     } else if (file.mimetype.startsWith('video/')) {
//         cb(null, true);
//     } else if (
//         file.mimetype === 'application/zip' ||
//         file.mimetype === 'application/x-zip-compressed' ||
//         file.mimetype === 'application/x-rar-compressed' ||
//         file.mimetype === 'application/x-tar' ||
//         file.mimetype === 'application/x-7z-compressed'
//     ) {
//         cb(null, true);
//     } else {
//         cb(new Error('فایل معتبر نیست. فقط تصاویر، ویدیوها و فایل‌های فشرده (zip, rar, tar, 7z) مجاز هستند'));
//     }

// };

// export const upload = multer({
//     storage: storage,
//     fileFilter: fileFilter,
//     limits: { fileSize: 500 * 1024 * 1024 }
// });


const storage = multer.diskStorage({})

export const upload = multer({ storage })

