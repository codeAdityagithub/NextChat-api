import express from "express";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

// Use Helmet!
app.use(helmet());
app.use(morgan("short"));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

const PORT = process.env.PORT;

app.listen(PORT || 8000, () => {
    console.log("app running on http://127.0.0.1:8000");
});
