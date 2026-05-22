import app from "./app"
import envConfig from "./config/config"
import { connectDB } from "./db/database";

const main = () => {
    app.listen(envConfig.port, () => {
        console.log(`Server running on port ::: ${envConfig.port}`);
    })
    connectDB();
}

main()