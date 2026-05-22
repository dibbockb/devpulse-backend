import type { Response } from "express"

type ResponseType<T> = {
    statusCode: number,
    message: string,
    success: boolean,
    data?: T,
    error?: string;
}

const sendResponse = <T>(res: Response, data: ResponseType<T>) => {
    const responseJson: Record<string, unknown> = {
        success: data.success,
        message: data.message,
    }
    if (data.data !== undefined) responseJson.data = data.data;
    if (data.error !== undefined) responseJson.error = data.error;

    res.status(data.statusCode).json(responseJson)
}

export default sendResponse;