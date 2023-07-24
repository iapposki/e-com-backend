import { Request, Express } from "express";


// export interface CustomRequest extends Request {
//     userDetails: any
// }
declare global {
    namespace Express {
        interface Request {
            userDetails?: any
        }
    }
}
// declare module "express-server-static-core" {
//     export interface Request {
//         userDetails?: any
//     }
// }

export { }