import { Response } from "express";
import { RequestwUser } from "../../types";
import path from "path";
import fs from "fs";

const location = path.join(__dirname, "../", "../", "../", "chatImages");

export default async function (req: RequestwUser, res: Response) {
    const imageName = req.params.fileName;
    const imagePath = path.join(location, imageName);
    // console.log(imagePath);
    // Check if the file exists
    if (fs.existsSync(imagePath)) {
        // Set the appropriate Content-Type header based on the image file extension
        res.setHeader("Content-Type", "image/jpeg");

        // Read the file and pipe it to the response
        const imageStream = fs.createReadStream(imagePath);
        imageStream.pipe(res);
    } else {
        // If the file doesn't exist, send a 404 Not Found response
        res.status(404).send("Image not found");
    }
}

// function getContentType(filePath:string) {
//     // Map file extensions to Content-Type
//     const extensionMap = {
//         ".jpg": "image/jpeg",
//         ".jpeg": "image/jpeg",
//         ".png": "image/png",
//         // Add more as needed
//     };

//     const extension = path.extname(filePath).toLowerCase();
//     return extensionMap[extension] || "application/octet-stream";
// }
