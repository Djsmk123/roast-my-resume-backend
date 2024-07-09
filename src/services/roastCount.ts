import { Request, Response } from 'express';
import firebase from "../db/db";
import { APIResponse, sendAPIResponse, createAPIResponse } from '../models/network_response_model';

export async function getRoastCount(request: Request, res: Response) {
    try {

        const snapshot = (await firebase.resumeRoastCountCollection.get()).docs[0];
        const roastCount = snapshot.data()['count'];
        return sendAPIResponse(res, createAPIResponse(200, roastCount.toString()));
    } catch (e) {
        console.error(e);
        return sendAPIResponse(res, createAPIResponse(500, e.message));
    }
}
