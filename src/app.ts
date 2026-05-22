import express, { type Application, type Request, type Response } from "express";
import cors from "cors"
import CookieParsar from "cookie-parser"
import globalErrorHandler from "./utility/globalErrorHandler";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { issuesRoute } from "./modules/issues/issues.route";

const app: Application = express();

app.use(cors({ origin: `http://localhost:5000` })) ///???move this to ENVIRONMENT
app.use(express.json())
app.use(express.text()) //???
app.use(CookieParsar())
app.use(express.urlencoded({ extended: true })) //???

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