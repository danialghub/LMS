import cloudinary from '../config/cloudinary.config.js'

// export const checkFileType = (file) => {
//     const name = file.originalname.toLowerCase();

//     // استخراج پسوند
//     const ext = name.split('.').pop();

//     if (ext === "zip")
//         return ["zip", ext];

//     if (ext === "rar")
//         return ["rar", ext];

// };

export const uploadImage = async (image, isThumbnail) => {

    const transformations = [];


    if (isThumbnail) {
        transformations.push({
            width: 800,  // عرض پیشنهادی
            height: 450, // 800 * 9/16 = 450
            crop: "fill",
            gravity: "face",
            aspect_ratio: "16:9"
        });
    } else {
        transformations.push({
            crop: "fill",
            gravity: "face"
        });
    }


    transformations.push({
        quality: "auto",
        fetch_format: "auto"
    });

    const { secure_url } = await cloudinary.uploader.upload(image, {
        transformation: transformations
    });

    return secure_url;
}
export const uploadVideo = async (video) => {
    const transformations = [
        {
            crop: "fill",
            aspect_ratio: "16:9"
        },
        {
            quality: "auto",
            fetch_format: "auto"
        }
    ];

    const { secure_url } = await cloudinary.uploader.upload(video, {
        resource_type: "video",
        transformation: transformations
    });

    return secure_url;
}
export const uploadFile = async (file) => {
    const result = await cloudinary.uploader.upload(file, {
        resource_type: "raw",
        transformation: [
            {
                quality: "auto"
            }
        ]
    });

    return {
        url: result.secure_url,
        bytes: result.bytes,
        format: result.format,
    };
}