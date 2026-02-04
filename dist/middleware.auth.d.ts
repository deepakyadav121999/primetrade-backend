import { Request, Response, NextFunction } from "express";
export interface AuthRequest extends Request {
    userId: string;
}
export declare const authMiddleware: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=middleware.auth.d.ts.map