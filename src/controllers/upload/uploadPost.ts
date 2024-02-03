import { NextFunction, Response } from "express";
import { RequestwUser } from "../../types";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import sql from "../../utils/db";

export default function (req: RequestwUser, res: Response, next: NextFunction) {
    const iat = Number(req.user?.picture?.split("=")[1]);
    if (iat && !isNaN(iat)) {
        // console.log(iat);
        const curDate = new Date().getTime();
        const diff = (curDate - iat) / 1000;
        // console.log(diff);
        if (diff < 60 * 60 * 24) {
            return res
                .status(429)
                .json("You can only update your profile once a day");
        }
    }

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
            return res.status(400).json("No file Uploaded");
        const pp = files.profilePicture[0];
        // const ext = pp.originalFilename?.split(".").pop();
        const oldPath = pp.filepath;
        const newPath = path.join(location, `${req.user?.sub!}.jpg`);

        try {
            await fs.rename(oldPath, newPath);
            await sql`update users set has_dp=TRUE where users.id=${req.user
                ?.sub!}`;

            return res.status(200).json("File Uploaded Succesfuly");
        } catch (error: any) {
            console.log(error?.message);
            return res.status(400).json("Something went wronmg");
        }
    });
}
