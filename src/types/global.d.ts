declare global {
    namespace Express {
        interface Request {
            user?: {
                username: string;
                id: string;
            }
        }
    }

    
}

export {}