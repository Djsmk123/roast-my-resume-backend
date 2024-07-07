import { Response } from 'express';
interface APIResponse {
    code: number;
    message: string;
    data: any;

}

function createAPIResponse(code: number, message: string, data?: any): APIResponse {
    return { code, message, data };
}

function sendAPIResponse(res: Response, response: APIResponse) {
    const { code, message, data } = response;
    if (data) {
        return res.status(code).json({ message, data, code });
    }
    res.status(code).json({ message, code });

}
export { createAPIResponse, sendAPIResponse, APIResponse };