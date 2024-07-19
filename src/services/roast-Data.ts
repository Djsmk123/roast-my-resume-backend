import firebase from "../db/db";
import { createAPIResponse, sendAPIResponse } from '../models/network_response_model'
import { Request, Response } from 'express';
interface RoastResponse {
    roast: string;
    id: string;
    entity: string;
    meme: {
        output: string;
        outputFull: {
            type: string;
            value: string;
            width: number;
            height: number;
            html: string;
        };
    } | null;
};



async function getRoastData(
    request: Request,
    res: Response
) {
    try {
        const id = request.params.id;
        const roastData = await firebase.resumeRoastCollectionV2.doc(id).get();
        if (roastData.exists) {
            const roast = roastData.data();
            const roastResponse: RoastResponse = {
                roast: roast.roastText,
                id: roastData.id,
                meme: roast.meme,
                entity: roast.entity
            };
            return sendAPIResponse(res, createAPIResponse(200, "Roast found successfully", roastResponse));

        }
        return sendAPIResponse(res, createAPIResponse(404, 'Roast not found'));


    } catch (e) {
        console.error(e);
        return sendAPIResponse(res, createAPIResponse(500, e.message));
    }
}
export default getRoastData;