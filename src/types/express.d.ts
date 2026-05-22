import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number | string;
                email: string;
                role: string;
            };
            tokenPayload?: JwtPayload;
        }
    }
}


// ??? reverse engineer this