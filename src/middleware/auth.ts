import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import envConfig from "../config/config";
import { pool } from "../db/database";

const checkToken = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization;
            if (!token) {
                return sendResponse(res, {
                    success: false,
                    statusCode: 403,
                    message: `Unauthorized!`
                })
            }
            return next();
        } catch (error) {
            return next(error)
        }
    }
}

const verifyUser = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization as string;
            const decodedToken = jwt.verify(token, envConfig.jwt_secret as string,) as JwtPayload;

            const userData = await pool.query(`
            SELECT * FROM users WHERE email=$1
            `, [decodedToken.email])

            const user = userData.rows[0]
            if (!user) {
                return sendResponse(res, { statusCode: 404, success: false, message: "User not found" });
            }
            delete user.password;

            req.user = user;
            req.tokenPayload = decodedToken;

            return next();
        } catch (error) {
            return next(error)
        }
    }
}

const checkRole = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const decodedToken = req.tokenPayload;

            if (!user || !decodedToken) {
                return sendResponse(res, { statusCode: 404, success: false, message: "User not found" });
            }

            if (decodedToken.role !== user.role) {
                return sendResponse(res, { statusCode: 403, success: false, message: "Token dont match" });
            }

            if (user.role && roles.includes(user.role)) {
                console.log(`Permission granted`);
                return next();
            }
            return sendResponse(res, { statusCode: 401, success: false, message: `You do not have permission` })
        } catch (error) {
            return next(error);
        }
    }
}

export const auth = { checkToken, verifyUser, checkRole };