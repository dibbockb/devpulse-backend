import { pool } from "../../db/database";
import type { UserInterface } from "./user.interface";
import bcrypt from "bcrypt";

const createUserInDB = async (payload: UserInterface) => {
    const { name, email, password, role } = payload;
    const hashedPwd = await bcrypt.hash(password, 10)

    const result = await pool.query(`
        INSERT INTO users(name, email, password, role)
        VALUES ($1, $2, $3, COALESCE($4, 'contributor'))
        RETURNING *
        `, [name, email, hashedPwd, role])

    delete result.rows[0].password;
    return result;
}

export const userService = {
    createUserInDB
}