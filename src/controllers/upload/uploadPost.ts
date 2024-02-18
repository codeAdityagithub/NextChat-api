import { NextFunction, Response } from "express";
import { RequestwUser } from "../../types";
import formidable from "formidable";
import fs from "fs/promises";
import path from "path";
import sql from "../../utils/db";

export default async function (
    req: RequestwUser,
    res: Response,
    next: NextFunction
) {
    const mydp = (await sql`select dp from users where id=${req.user?.sub!}`)[0]
        .dp;
    const iat = mydp ? Number(mydp.split("=")[1]) : NaN;

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

            const updated = new Date().getTime();
            const dpUrl = `${process.env.API_URL}/static/profiles/${req.user?.sub}.jpg?updated=${updated}`;

            await sql`update users set dp=${dpUrl} where users.id=${req.user
                ?.sub!}`;

            return res.status(200).json("File Uploaded Succesfuly");
        } catch (error: any) {
            console.log(error?.message);
            return res.status(400).json("Something went wronmg");
        }
    });
}
