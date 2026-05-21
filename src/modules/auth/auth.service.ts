import bcrypt from "bcryptjs";
import { pool } from "../../db/database";
import jwt, { type JwtPayload } from "jsonwebtoken"
import envConfig from "../../config/config";


const loginUserIntoDB = async (payload: { email: string, password: string }) => {
    const { email, password } = payload;

    const userData = await pool.query(`
        SELECT * FROM users WHERE email=$1
        `, [email])


    if (userData.rows.length === 0) {
        throw new Error(`🔴 Invalid Credentials.`)
    }

    const user = userData.rows[0];
    const matchPwd = await bcrypt.compare(password, user.password)
    if (!matchPwd) {
        throw new Error(`🔴 Wrong Password.`)
    }

    delete user.password;

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