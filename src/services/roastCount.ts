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
    const snapshot = await firebase.resumeRoastCollection.get();
    const roastCount = snapshot.size + 800//initial count of 500 roast,you can change it to 0 if you want to start from 0;
    return sendAPIResponse(res, createAPIResponse(200, roastCount.toString()));
}
