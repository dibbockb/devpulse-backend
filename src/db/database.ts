import { Pool } from "pg";
import envConfig from "../config/config";

export const pool = new Pool({
    connectionString: envConfig.db_key
})

export const connectDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'contributor' CHECK (role IN ('contributor', 'maintainer')),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS issues(
            id SERIAL PRIMARY KEY,
            title VARCHAR(150) NOT NULL,
            description TEXT NOT NULL CHECK (LENGTH(TRIM(description)) >= 20),
            type TEXT NOT NULL CHECK (type IN ('bug', 'feature_request')),
            status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
            reporter_id INTEGER,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `)
        console.log(`🟢 Connected to Database...`);


    } catch (error) {
        console.log(`🔴 Failed to connect to Database...`);
        console.log(error);
    }
}