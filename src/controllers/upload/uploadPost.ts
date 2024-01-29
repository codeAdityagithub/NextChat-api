import { NextFunction, Response } from "express";
import { RequestwUser } from "../../types";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";

export default function (req: RequestwUser, res: Response, next: NextFunction) {
    const location = path.join(
        __dirname,
        "../",
        "../",
        "../",
        "public",
        "/profiles"
    );

    const form = formidable({ uploadDir: location });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        if (!files.profilePicture)
            return res.json("No file Uploaded").status(400);
        const pp = files.profilePicture[0];
        const ext = pp.originalFilename?.split(".").pop();
        const oldPath = pp.filepath;
        const newPath = path.join(location, `${req.user?.sub!}.jpg`);

        try {
            await fs.rename(oldPath, newPath);
        } catch (error: any) {
            console.log(error?.message);
            return res.json("Something went wronmg").status(500);
        }

        res.json("File Uploaded Succesfuly").status(200);
    });
}
