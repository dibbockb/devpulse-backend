import express, { type Application, type Request, type Response } from "express";
import globalErrorHandler from "./utility/globalErrorHandler";

const app: Application = express();

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