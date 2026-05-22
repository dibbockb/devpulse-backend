import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import envConfig from "../config/config";
import { pool } from "../db/database";

const checkToken = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if (!token) {
            return sendResponse(res, {
                success: false,
                statusCode: 403,
                message: `Unauthorized!`
            })
        }
        next()
    }
}

const verifyUser = () => {
    return async (req: Request, res: Response, next: NextFunction) => {

        const token = req.headers.authorization as string;
        const decodedToken = jwt.verify(token, envConfig.jwt_secret as string,) as JwtPayload;

        const userData = await pool.query(`
            SELECT * FROM users WHERE email=$1
            `, [decodedToken.email])

        const user = userData.rows[0]
        delete user.password;

        if (userData.rows.length === 0) {
            return sendResponse(res, {
                success: false,
                statusCode: 403,
                message: `Forbidden!`
            })
        }
        next();
    }
}

export const authMiddlewares = { checkToken, verifyUser };