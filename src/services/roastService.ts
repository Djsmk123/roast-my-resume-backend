import roastRequestSchema from "../models/roast_request_model";
import { Request, Response } from 'express';
import { createAPIResponse, sendAPIResponse } from '../models/network_response_model';
import { constants } from "../utils/constant";
import loadWordsFromRemoteConfig from "../utils/remote_cofing";
import getPromptHelper from "../utils/prompt-builder";
import parsePDF from "../utils/pdf-text-extractor";
import model from "../utils/gemini";
import firebase from "../db/db";
import dotenv from 'dotenv';
import { generateMeme, getFeaturedMemes } from './glif';
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
        const words = await loadWordsFromRemoteConfig();
        const prompt = getPromptHelper(
            roleType,
            roastTone,
            words,
            languageType,
        );
        let resumeText = roastRequest.textBasedResume;
        if (resumeFile) {
            //parse pdf
            const pdfText = await parsePDF(resumeFile);
            if (pdfText) {
                resumeText = pdfText;
            } else {
                return sendAPIResponse(res, createAPIResponse(400, "Error parsing pdf"));
            }
        }


        //generate roast
        const content: any = [
            { role: "model", parts: [{ text: prompt }] },
            { role: "user", parts: [{ text: resumeText }] },
        ];



        const result = await model.generateContent(
            {
                contents: content,
                safetySettings: constants.safetySettings,
            }
        );



        const env = process.env.NODE_ENV;
        console.log(env);

        try {
            if (roastRequest.meme === "true") {
                const meme = await generateMeme(result.response.text(), "clxtc53mi0000ghv10g6irjqj");
                return sendAPIResponse(res, createAPIResponse(200,
                    "Roast generated successfully", { roast: result.response.text(), meme: meme }));
            }
            if (env !== "development") {
                await firebase.resumeRoastCollection.add({
                    roastText: result.response.text(),
                    roastLevel: roastTone,
                    createdAt: new Date(),
                    role: roleType,
                    language: languageType,

                });

                const snapshot = (await firebase.resumeRoastCountCollection.get()).docs[0];
                const roastCount = snapshot.data()['count'] + 1;
                //update document
                await firebase.resumeRoastCountCollection.doc(snapshot.id).update({
                    'count': roastCount
                });


            }
        } catch (e) {
            //ignore
            console.log(e);

        }

        return sendAPIResponse(res, createAPIResponse(200, "Roast generated successfully", { roast: result.response.text() }));
    } catch (e) {
        return sendAPIResponse(res, createAPIResponse(500, "Internal server error"));
    }
}
