export const checkFileType = (file) => {
    const name = file.originalname.toLowerCase();

    // استخراج پسوند
    const ext = name.split('.').pop(); 

    if (ext === "zip")
        return ["zip", ext];

    if (ext === "rar")
        return ["rar", ext];

};