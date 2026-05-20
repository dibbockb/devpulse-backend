import app from "./app"
import envConfig from "./config/config"

const main = () => {
    app.listen(envConfig.port, () => {
        console.log(`🟢 Server running on port ::: ${envConfig.port}`);
    })
}

main()