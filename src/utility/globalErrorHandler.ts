import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const globalErrorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const statusCode = err instanceof Error && 'statusCode' in err ? (err as Error & { statusCode?: number }).statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR : StatusCodes.INTERNAL_SERVER_ERROR;

    const message =
        err instanceof Error ? err.message : "Something Went Wrong!";

    res.status(statusCode).json({
        success: false,
        message
    })
}

export default globalErrorHandler;