import loadWordsFromRemoteConfig from "../utils/remote_cofing";
import getPromptHelper from "../utils/prompt-builder";

import { constants } from "../utils/constant";
import model from "../utils/gemini";
import firebase from "../db/db";


import { generateMeme } from './glif';

interface RoastHelperInput {
    roastTone: string;
    roleType: string;
    languageType: string;
    text: string;
    hasMeme: boolean;
    entity: string;

}
interface RoastHelperOutput {
    roast: string;
    id: string;
    meme: any | null;
}
async function roastHelper(
    roastRequest: RoastHelperInput
): Promise<RoastHelperOutput> {
    const words = await loadWordsFromRemoteConfig();
    const { roastTone, roleType, languageType, entity, hasMeme } = roastRequest;
    const prompt = getPromptHelper(
        roastTone,
        roleType,
        words,
        languageType,
        entity,
    );
    //generate roast
    const content: any = [
        { role: "model", parts: [{ text: prompt }] },
        { role: "user", parts: [{ text: roastRequest.text }] },
    ];

    const result = await model.generateContent(
        {
            contents: content,
            safetySettings: constants.safetySettings,
        }
    );
    const roastText = result.response.text();
    let docId = "";
    let meme = null;
    if (hasMeme) {
        meme = await generateMeme(roastText, "clxtc53mi0000ghv10g6irjqj");
    }
    const data: any = {
        roastText: roastText,
        roastLevel: roastTone,
        createdAt: new Date(),
        role: roleType,
        language: languageType,
        meme: meme,
        entity: entity,
    };

    const doc = await firebase.resumeRoastCollectionV2.add(data);
    console.log("Document written with ID: ", doc.id);
    docId = doc.id;
    const snapshot = (await firebase.resumeRoastCountCollection.get()).docs[0];
    const roastCount = snapshot.data()['count'] + 1;
    //update document
    await firebase.resumeRoastCountCollection.doc(snapshot.id).update({
        'count': roastCount
    });
    if (meme) {
        return {
            roast: roastText,
            id: docId,
            meme: meme
        };
    }
    return {
        roast: roastText,
        id: docId,
        meme: null
    };
}

async function getLinkedInProfile(
    profileUrl: string
) {
    const baseURl = "https://linkedin-data-api.p.rapidapi.com/get-profile-data-by-url?url=" + profileUrl;
    const fetchResponse = await fetch(baseURl, {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'linkedin-data-api.p.rapidapi.com'
        }
    });
    console.log(fetchResponse);
    if (fetchResponse.status !== 200) {
        return null;
    }
    const responseBody = await fetchResponse.text();
    var response = JSON.parse(responseBody);
    return response;

    // const baseUrl = "https://api.scrapingdog.com/linkedin";
    // const apiKey = process.env.SCRAPINGDOG_API_KEY;
    // const type = "profile";
    // const regex = /linkedin\.com\/in\/([a-zA-Z0-9-]+)/;
    // const match = profileUrl.match(regex);
    // const linkId = match ? match[1] : null;
    // const url = `${baseUrl}/?api_key=${apiKey}&type=${type}&linkId=${linkId}`;
    // const fetchResponse = await fetch(url, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    // });
    // console.log(fetchResponse);
    // if (fetchResponse.status !== 200) {
    //     return null;
    // }
    // const responseBody = await fetchResponse.text();
    // var response = JSON.parse(responseBody);
    // console.log(response);
    // return response[0];
}



export default { roastHelper, getLinkedInProfile };