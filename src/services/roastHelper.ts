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
    //check in firebase if the profile is already roasted and not expired
    const snapshot = await firebase.linkedProfilesCollection.where('profileUrl', '==', profileUrl).where('expires', '>', new Date()).get();
    if (!snapshot.empty) {
        //parse the data
        const data = snapshot.docs[0].data();
        //remove profileUrl and expires
        delete data['profileUrl'];
        delete data['expires'];
        console.log(data);
        return data;
    }

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
    //store the data in firebase
    response['profileUrl'] = profileUrl;
    //30 days expiry
    response['expires'] = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000);
    await firebase.linkedProfilesCollection.add(response);

    return response;


}



export default { roastHelper, getLinkedInProfile };