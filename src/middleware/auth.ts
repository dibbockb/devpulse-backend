import type { NextFunction, Request, Response } from "express";
import sendResponse from "../utility/sendResponse";
import jwt, { type JwtPayload } from "jsonwebtoken";
import envConfig from "../config/config";
import { pool } from "../db/database";
import type { DBUserInterface } from "../types/user.type";
import { StatusCodes } from "http-status-codes";

const verifyToken = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization as string;
            const decodedToken = jwt.verify(token, envConfig.jwt_secret as string) as JwtPayload;

            req.user = {
                id: decodedToken.id,
                email: decodedToken.email,
                role: decodedToken.role,
            };

            return next();
        } catch (error) {
            return next(error);
        }
    }
}

const checkRole = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = req.user;
            const decodedToken = req.tokenPayload;

            if (!user || !decodedToken) {
                return sendResponse(res, { statusCode: StatusCodes.NOT_FOUND, success: false, message: "User not found" });
            }

            if (decodedToken.role !== user.role) {
                return sendResponse(res, { statusCode: StatusCodes.FORBIDDEN, success: false, message: "Token dont match" });
            }

            if (user.role && roles.includes(user.role)) {
                return next();
            }
            return sendResponse(res, { statusCode: StatusCodes.FORBIDDEN, success: false, message: `You do not have permission` })
        } catch (error) {
            return next(error);
        }
    }
}

const checkUpdatePermission = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const userRole = req.user?.role;
            const { id: issueId } = req.params;

            const issueResult = await pool.query(`
                SELECT reporter_id, status FROM issues WHERE id=$1
                `, [issueId])

            const issue = issueResult.rows[0];

            if (!issue) {
                return res.status(StatusCodes.NOT_FOUND).json({
                    success: false,
                    message: "Issue not found"
                });
            }

            if (userRole === 'maintainer') {
                return next();
            }

            if (userRole === 'contributor') {
                const isOwner = Number(userId) === Number(issue.reporter_id);
                const isOpen = issue.status === 'open';

                if (isOwner && isOpen) {
                    return next();
                }
            }

            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: "You do not have permission."
            });

        } catch (error) {
            return next(error)
        }
    }
}

export const auth = { verifyToken, checkRole, checkUpdatePermission };