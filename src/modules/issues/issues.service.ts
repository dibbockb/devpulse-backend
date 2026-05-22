import { pool } from "../../db/database";
import type { IssuesInterface } from "./issues.type";

const createIssueIntoDB = async (payload: IssuesInterface) => {
    const { title, description, type, reporter_id } = payload;

    const result = await pool.query(`
        INSERT INTO issues(title, description, type, reporter_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `, [title, description, type, reporter_id])

    const createdIssueData = result.rows[0]

    return createdIssueData;
}

const getIssuesFromDB = async () => {
    const issuesList = await pool.query(`
        SELECT 
            i.id, i.title, i.description, i.type, i.status, i.created_at, i.updated_at,
            u.id AS user_id, u.name AS user_name, u.role AS user_role
        FROM issues i
        LEFT JOIN users u ON i.reporter_id = u.id
    `)
    return issuesList;
}

const getSingleIssueFromDB = async (id: string) => {
    const requestedIssue = await pool.query(`
        SELECT 
            i.id, i.title, i.description, i.type, i.status, i.created_at, i.updated_at,
            u.id AS user_id, u.name AS user_name, u.role AS user_role
        FROM issues i
        LEFT JOIN users u ON i.reporter_id = u.id
        WHERE i.id = $1
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