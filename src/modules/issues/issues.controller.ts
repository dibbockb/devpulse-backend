import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const reporterId = req.user?.id;
        const issuedData = {
            ...req.body,
            reporter_id: reporterId
        }
        const createdIssueData = await issueService.createIssueIntoDB(issuedData)

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
    try {
        const result = await issueService.getIssuesFromDB();

        const formattedIssues = result.rows.map((issue: any) => ({
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: {
                id: issue.user_id,
                name: issue.user_name,
                role: issue.user_role
            },
            created_at: issue.created_at,
            updated_at: issue.updated_at
        }));

        res.status(200).json({
            success: true,
            data: formattedIssues
        });
    } catch (error) {
        sendResponse(res, {
            success: false,
            statusCode: 500,
            message: "Unable to retrive issues.",
        })
    }

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
        const issue = result.rows[0];
        const formattedSingleIssue = {
            id: issue.id,
            title: issue.title,
            description: issue.description,
            type: issue.type,
            status: issue.status,
            reporter: {
                id: issue.user_id,
                name: issue.user_name,
                role: issue.user_role
            },
            created_at: issue.created_at,
            updated_at: issue.updated_at
        };

        res.status(200).json({
            success: true,
            data: formattedSingleIssue
        });

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
            error: (error as Error).message
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
