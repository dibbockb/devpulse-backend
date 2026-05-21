import type { Request, Response } from "express";
import sendResponse from "../../utility/sendResponse";
import { issueService } from "./issues.service";

const createIssue = async (req: Request, res: Response) => {
    try {
        const createdIssueData = await issueService.createIssue(req.body)

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
            // message: error.message
            message: `Unable to create issue`,
        })
    }
}

export const issuesController = {
    createIssue,
}
