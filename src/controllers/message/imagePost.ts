import { NextFunction, Response } from "express";
import { RequestwUser } from "../../types";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import sql from "../../utils/db";

const location = path.join(__dirname, "../", "../", "../", "chatImages");

export default async function (
    req: RequestwUser,
    res: Response,
    next: NextFunction
) {
    const form = formidable({ uploadDir: location });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        if (!files.image) return res.status(400).json("No file Uploaded");
        const image = files.image[0];
        // const ext = pp.originalFilename?.split(".").pop();
        const oldPath = image.filepath;
        const fileName = Date.now() + "_" + req.user?.sub!;
        const newPath = path.join(location, `${fileName}.jpg`);

        console.log(image.size);
        try {
            await fs.rename(oldPath, newPath);

            return res.status(200).json("File Uploaded Succesfuly");
        } catch (error: any) {
            console.log(error?.message);
            return res.status(500).json("Something went wrong");
        }
    });
}
