import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";
import { StatusCodes } from "http-status-codes";

const createIssue = async (req: Request, res: Response) => {
    try {
        const { title, description, type } = req.body;
        if (!title || !description || !type) {
            return sendResponse(res, {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "title / description / type is required"
            });
        }

        if (!['bug', 'feature_request'].includes(type)) {
            return sendResponse(res, {
                statusCode: StatusCodes.BAD_REQUEST,
                success: false,
                message: "type must be 'bug' / 'feature_request'"
            });
        }

        const reporterId = req.user?.id;
        const issuedData = {
            ...req.body,
            reporter_id: reporterId
        }
        const createdIssueData = await issueService.createIssueIntoDB(issuedData)

        sendResponse(res, {
            success: true,
            statusCode: StatusCodes.CREATED,
            message: "Issue created successfully",
            data: createdIssueData
        })

    } catch (error) {
        sendResponse(res, {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: (error as Error).message
        })
    }
}

const getIssues = async (req: Request, res: Response) => {
    try {
        const { sort, type, status } = req.query;

        const issues = await issueService.getIssuesFromDB({
            sort: sort as string,
            type: type as string,
            status: status as string,
        });
        res.status(StatusCodes.OK).json({
            success: true,
            data: issues
        });

    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Unable to retrieve issues."
        })
    }
}

const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const issue = await issueService.getSingleIssueFromDB(req.params.id as string)

        if (!issue) {
            return sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue not found",
            });
        }

        res.status(StatusCodes.OK).json({ success: true, data: issue });

    } catch (error) {
        sendResponse(res, { statusCode: StatusCodes.INTERNAL_SERVER_ERROR, success: false, message: (error as Error).message })
    }
}

const updateIssue = async (req: Request, res: Response,) => {

    try {
        const updatedIssue = await issueService.updateIssueInDB(req.body, req.params.id as string)
        sendResponse(res, {
            statusCode: StatusCodes.OK,
            "success": true,
            "message": "Issue updated successfully",
            data: updatedIssue
        })

    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Unable to Update Issue",
            error: (error as Error).message
        })
    }
}

const deleteIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.deleteIssueFromDB(req.params.id as string)
        if (!result.rowCount) {
            return sendResponse(res, {
                statusCode: StatusCodes.NOT_FOUND,
                success: false,
                message: "Issue not found",
            });
        }

        sendResponse(res, {
            statusCode: StatusCodes.OK,
            "success": true,
            "message": "Issue deleted successfully",
        })

    } catch (error) {
        sendResponse(res, {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            success: false,
            message: "Unable to Delete Issue",
            error: (error as Error).message
        })
    }
}

export const issuesController = {
    createIssue,
    getIssues,
    getSingleIssue,
    updateIssue,
    deleteIssue
}
