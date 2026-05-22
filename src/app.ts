import express, { type Application, type Request, type Response } from "express";
import cors from "cors"
import CookieParsar from "cookie-parser"
import globalErrorHandler from "./utility/globalErrorHandler";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";
import envConfig from "./config/config";

const app: Application = express();

app.use(cors({ origin: envConfig.cors_origin }))
app.use(express.json())
app.use(CookieParsar())

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        "message": "Server Running...",
    })
})

app.use(`/api/auth/signup`, userRoute)
app.use(`/api/auth`, authRoute)
app.use(`/api/issues`, issuesRoute)

app.use(globalErrorHandler);

export default app;