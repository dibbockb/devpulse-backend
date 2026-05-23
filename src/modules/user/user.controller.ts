import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { userService } from "./user.service";
import { StatusCodes } from "http-status-codes";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await userService.createUserInDB(req.body);

        sendResponse(res, {
            statusCode: StatusCodes.CREATED,
            success: true,
            message: "User registered successfully",
            data: result.rows[0]
        })

    } catch (error) {
        const isUniqueViolation = (error as { code?: string }).code === '23505';

        sendResponse(res, {
            statusCode: isUniqueViolation ? StatusCodes.BAD_REQUEST : StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: isUniqueViolation ? "Email already exists" : (error as Error).message,
        })
    }
}

export const userController = {
    createUser
}