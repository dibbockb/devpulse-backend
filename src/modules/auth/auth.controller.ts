import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUserIntoDB(req.body)

        const { token, user } = result;

        res.cookie(`token`, token, { secure: false, httpOnly: true, sameSite: "lax" })

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: "Login successful",
            data: { token, user },
        })

    } catch (error) {
        sendResponse(res, {
            statusCode: 401,
            success: false,
            message: `Invalid Credentials`
        })
    }
}

export const authController = {
    loginUser
}