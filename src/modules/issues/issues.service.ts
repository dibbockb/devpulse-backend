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
    const issuesList = await pool.query(`
    SELECT * FROM issues
    `)
    return issuesList;
}

const getSingleIssueFromDB = async (id: string) => {
    const requestedIssue = await pool.query(`
    SELECT * FROM issues 
    WHERE id=$1
    `, [id])
    return requestedIssue;
}

const updateIssueInDB = async (payload: IssuesInterface, id: string) => {
    const { title, description, type } = payload;
    const result = await pool.query(`
        UPDATE issues

        SET
            title=COALESCE($1, title),
            description=COALESCE($2, description),
            type=COALESCE($3, type),
            status = 'in_progress',
            updated_at = NOW()

        WHERE id = $4
        RETURNING *
        `, [title, description, type, id])

    return result.rows[0];
}

const deleteIssueFromDB = async (id: string) => {
    const result = await pool.query(`
    DELETE FROM issues 
    WHERE id=$1 
    RETURNING id
    `, [id])

    return result;
}


export const issueService = {
    createIssueIntoDB,
    getIssuesFromDB,
    getSingleIssueFromDB,
    updateIssueInDB,
    deleteIssueFromDB
}