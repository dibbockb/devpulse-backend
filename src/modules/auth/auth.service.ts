import bcrypt from "bcrypt";
import { pool } from "../../db/database";
import jwt, { type JwtPayload } from "jsonwebtoken"
import envConfig from "../../config/config";
import type { DBUserInterface } from "../../types/user.type";


const loginUserIntoDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])


    if (userData.rows.length === 0) {
        throw new Error(`Invalid Credentials.`)
    }

    const dbuser = userData.rows[0] as DBUserInterface;
    const matchPwd = await bcrypt.compare(password, dbuser.password as string)
    if (!matchPwd) {
        throw new Error(`Wrong Password.`)
    }

    const { password: _, ...user } = dbuser;

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
    }

    const token = jwt.sign(jwtPayload, envConfig.jwt_secret as string, { expiresIn: '30d' })

    return { token, user };
}

export const authService = {
    loginUserIntoDB
}