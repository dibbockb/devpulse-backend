import type { Response } from "express"

type ResponseType<T> = {
    statusCode: number,
    message: string,
    success: boolean,
    data?: T,
    error?: any,
}

const sendResponse = <T>(res: Response, data: ResponseType<T>) => {
    res.status(data.statusCode).json({
        success: data.success,
        message: data.message,
        data: data.data,
        error: data.error
    })
}

export default sendResponse;