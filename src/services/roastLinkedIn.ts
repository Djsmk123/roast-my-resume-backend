import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { createAPIResponse, sendAPIResponse } from '../models/network_response_model';
import linkedInRequestSchema from '../models/linkedIn_request_model';
import { constants } from '../utils/constant';
import helper from './roastHelper';
import roastHelper from './roastHelper';

dotenv.config();
async function roastLinkedIn(
    req: Request,
    res: Response
) {
    try {
        const body = await req.body;
        console.log(body);
        //validate request
        const linkedInRequest = linkedInRequestSchema.parse(body);
        //check if the request is valid
        if (!linkedInRequest) {
            return sendAPIResponse(res, createAPIResponse(400, "Invalid request"));
        }
        const roastLevel = parseInt(linkedInRequest.roastLevel); //index of roast level


        const role = parseInt(linkedInRequest.role);
        const language = parseInt(linkedInRequest.language);
        const roastTone = Object.values(constants.Tones)[roastLevel];
        const roleType = Object.values(constants.Roles)[role];
        const languageType = Object.values(constants.Languages)[language];
        const linkedInProfile = linkedInRequest.linkedProfile;

        const linkedInProfileData = await roastHelper.getLinkedInProfile(linkedInProfile);
        if (!linkedInProfileData) {
            return sendAPIResponse(res, createAPIResponse(400, "Invalid LinkedIn profile"));
        }

        const resonse = await helper.roastHelper({
            roastTone,
            roleType,
            languageType,
            text: "Profile: " + JSON.stringify(linkedInProfileData),
            hasMeme: linkedInRequest.meme == "true",
            entity: "My Linked Profile",
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

export default roastLinkedIn;