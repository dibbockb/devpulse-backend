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
    const issuesResult = await pool.query(`
    SELECT * FROM issues ORDER BY created_at DESC
    `)

    const issues = issuesResult.rows;
    if (issues.length === 0) { return [] };

    const reporterIds = [...new Set(issues.map((i: any) => i.reporter_id))];

    const usersResult = await pool.query(`
        SELECT id, name, role FROM users WHERE id = ANY($1::int[])
    `, [reporterIds])

    const userMap: Record<number, any> = {};
    usersResult.rows.forEach((u: any) => {
        userMap[u.id] = u;
    });

    const formattedIssuesList = issues.map((issue: any) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: userMap[issue.reporter_id],
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }))

    return formattedIssuesList;
}

const getSingleIssueFromDB = async (id: string) => {
    const issueResult = await pool.query(`
        SELECT * FROM issues WHERE id = $1
        `, [id])

    if (issueResult.rows.length === 0) {
        return null;
    }
    const issue = issueResult.rows[0];

    const userResult = await pool.query(`
        SELECT id, name, role FROM users WHERE id = $1
    `, [issue.reporter_id])

    const reporter = userResult.rows[0];

    const formattedIssue = {
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }
    return formattedIssue;
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