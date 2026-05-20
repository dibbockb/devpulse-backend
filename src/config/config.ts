import path from "path";
import dotenv from "dotenv"

dotenv.config({
    path: path.join(process.cwd(), ".env"),
})

const envConfig = {
    port: process.env.PORT,
    db_key: process.env.DB_KEY,
}

export default envConfig;