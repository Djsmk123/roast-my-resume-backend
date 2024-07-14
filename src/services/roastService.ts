import roastRequestSchema from "../models/roast_request_model";
import { Request, Response } from 'express';
import { createAPIResponse, sendAPIResponse } from '../models/network_response_model';
import { constants } from "../utils/constant";
import parsePDF from "../utils/pdf-text-extractor";
import dotenv from 'dotenv';
import roastHelper from './roastHelper';
dotenv.config();
export default async function generateRoast(request: Request, res: Response) {
    try {
        const body = await request.body;
        console.log(body);
        const roastRequest = roastRequestSchema.parse(body);
        //check if roastRequest is valid
        if (!roastRequest) {
            return sendAPIResponse(res, createAPIResponse(400, "Invalid request"));
        }
        let resumeFile;
        if (Array.isArray(request.files) && request.files.length > 0) {
            resumeFile = request.files[0].buffer;
        }
        if (!roastRequest.textBasedResume && !resumeFile) {
            return sendAPIResponse(res, createAPIResponse(400, "No resume provided"));
        }
        const roastLevel = parseInt(roastRequest.roastLevel); //index of roast level
        const role = parseInt(roastRequest.role);
        const language = parseInt(roastRequest.language);
        const roastTone = Object.values(constants.Tones)[roastLevel];
        const roleType = Object.values(constants.Roles)[role];
        const languageType = Object.values(constants.Languages)[language];
        let resumeText = roastRequest.textBasedResume;
        if (resumeFile) {
            //parse pdf
            const pdfText = await parsePDF({ buffer: resumeFile, url: null });
            if (pdfText) {
                resumeText = pdfText;
            } else {
                return sendAPIResponse(res, createAPIResponse(400, "Error parsing pdf"));
            }
        }
        const resonse = await roastHelper({
            roastTone,
            roleType,
            languageType,
            resumeText,
            hasMeme: roastRequest.meme == "true"
        });
        if (!resonse) {
            return sendAPIResponse(res, createAPIResponse(500, "Internal server error"));
        }
        return sendAPIResponse(res, createAPIResponse(200, "Roast generated", resonse));



    } catch (e) {
        console.log(e);
        return sendAPIResponse(res, createAPIResponse(500, "Internal server error"));
    }
}
