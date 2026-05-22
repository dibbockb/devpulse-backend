import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUserInDB(req.body);

        sendResponse(res, {
            statusCode: 201,
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })

    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: (error as Error).message,
            error: error as string
        })
    }
}

export const userController = {
    createUser
}