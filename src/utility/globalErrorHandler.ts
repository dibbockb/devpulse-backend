import type { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something Went Wrong!"
    })
}

export default globalErrorHandler;