import { pool } from "../../db/database";
import type { IssuesInterface } from "./issues.type";

const createIssue = async (payload: IssuesInterface) => {
    const { title, description, type } = payload;

    const result = await pool.query(`
        INSERT INTO issues(title, description, type)
        VALUES ($1, $2, $3)
        RETURNING *
        `, [title, description, type])

    const createdIssueData = result.rows[0]

    return createdIssueData;
}

export const issueService = {
    createIssue,
}