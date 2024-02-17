// db.js
import postgres from "postgres";

const sql = postgres({
    ssl: process.env.NODE_ENV === "production",
    idle_timeout: 100,
});
// will use psql environment variables

export default sql;
