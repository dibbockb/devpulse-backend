import express, { type Application, type Request, type Response } from "express";
import cors from "cors"
import globalErrorHandler from "./utility/globalErrorHandler";

const app: Application = express();

app.use(cors({ origin: `http://localhost:5000` })) ///???move this to ENVIRONMENT
app.use(express.json())
app.use(express.text()) //???
app.use(express.urlencoded({ extended: true })) //???

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        "message": "Server Running...",
    })
})

app.use(globalErrorHandler);
export default app;