import { pool } from "../../db/database";
import type { IssuesInterface } from "./issues.type";

const createIssueIntoDB = async (payload: IssuesInterface) => {
    const { title, description, type } = payload;

    const result = await pool.query(`
        INSERT INTO issues(title, description, type)
        VALUES ($1, $2, $3)
        RETURNING *
        `, [title, description, type])

    const createdIssueData = result.rows[0]

    return createdIssueData;
}

const getIssuesFromDB = async () => {
    const result = await pool.query(`
    SELECT * FROM issues
    `)
    return result;
}

export const issueService = {
    createIssueIntoDB, getIssuesFromDB
}