import { Request, Response } from 'express';
import firebase from "../db/db";
import { APIResponse, sendAPIResponse, createAPIResponse } from '../models/network_response_model';

export async function getRoastCount(request: Request, res: Response) {
    //count the number of documents in the collection
    //check if development or production
    if (process.env.NODE_ENV === 'development') {
        console.log("Development mode")
        return sendAPIResponse(res, createAPIResponse(200, '0'))
    }
    const snapshot = (await firebase.resumeRoastCountCollection.get()).docs[0];
    const roastCount = snapshot.data()['count'];
    return sendAPIResponse(res, createAPIResponse(200, roastCount.toString()));
}
