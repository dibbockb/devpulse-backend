import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const createdIssueData = await issueService.createIssueIntoDB(req.body)

        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Issue created successfully",
            data: createdIssueData
        })

    } catch (error) {
        sendResponse(res, {
            success: false,
            statusCode: 500,
            message: (error as Error).message
        })
    }
}

const getIssues = async (req: Request, res: Response) => {
    const issuesList = await issueService.getIssuesFromDB();
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Retrieved All Issues.",
        data: issuesList.rows,
    })

}

const getSingleIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.getSingleIssueFromDB(req.params.id as string);
        if (!result.rowCount) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
            });
        }

        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: `Issue retrieved`,
            data: result.rows[0]
        })

    } catch (error) {
        sendResponse(res, {
            success: false,
            statusCode: 404,
            message: (error as Error).message

        })
    }
}

const updateIssue = async (req: Request, res: Response,) => {

    try {
        const updatedIssue = await issueService.updateIssueInDB(req.body, req.params.id as string)
        sendResponse(res, {
            statusCode: 200,
            "success": true,
            "message": "Issue updated successfully",
            data: updatedIssue
        })

    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Unable to Update Issue",
            errors: (error as Error).message
        })
    }
}

const deleteIssue = async (req: Request, res: Response) => {
    try {
        const result = await issueService.deleteIssueFromDB(req.params.id as string)
        if (!result.rowCount) {
            return sendResponse(res, {
                statusCode: 404,
                success: false,
                message: "Issue not found",
            });
        }

        sendResponse(res, {
            statusCode: 200,
            "success": true,
            "message": "Issue deleted successfully",
        })

    } catch (error) {
        sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Unable to Delete Issue",
            errors: (error as Error).message
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
