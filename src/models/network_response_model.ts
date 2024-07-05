import { Response } from 'express';
interface APIResponse {
    code: number;
    message: string;

}

function createAPIResponse(code: number, message: string): APIResponse {
    return { code, message };
}

function sendAPIResponse(res: Response, response: APIResponse) {
    res.status(response.code).json({
        message: response.message,
        code: response.code,
    });
}
export { createAPIResponse, sendAPIResponse, APIResponse };