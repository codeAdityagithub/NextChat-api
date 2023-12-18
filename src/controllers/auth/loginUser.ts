import { Request, Response } from "express";

export default function (req: Request, res: Response) {
    // const { email, password } = req.body;
    console.log(req.body);
    console.log(req.headers);
    res.send("hi");
}
