import multer from "multer";
import __dirname from "./utils.js";
import path from "path";

const destinationPath = path.join(__dirname, "public/uploads");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadFolder = "documents";
        if (file.mimetype.includes("image")) {
            uploadFolder = "images";
        }
        const finalPath = path.join(destinationPath, uploadFolder);
        cb(null, finalPath);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now()
        const originalName = file.originalname
        cb(null, `${timestamp}-${originalName}`)
    }
});

const uploader = multer({ storage: storage });

export default uploader;