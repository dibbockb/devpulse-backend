import path from "path";
import dotenv from "dotenv"

dotenv.config({
    path: path.join(process.cwd(), ".env")
})

const envConfig = {
    port: process.env.PORT,
}

export default envConfig;