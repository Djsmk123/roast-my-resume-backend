import { cert, getApp, getApps, initializeApp, } from 'firebase-admin/app';
import { getFirestore, } from 'firebase-admin/firestore';
import { getRemoteConfig } from 'firebase-admin/remote-config';
import { config } from 'dotenv';
config();

const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
);
let regularObj = {};
const env = process.env.NODE_ENV;
if (env === 'development') {
    const FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST;
}

Object.assign(regularObj, serviceAccount);




const firebaseAdminConfig = {
    credential: cert(regularObj)
}
const app = getApps().length > 0 ? getApp() :
    env === 'development' ? initializeApp({
        projectId: "roast-my-resume",
        credential: firebaseAdminConfig.credential,
    }) :
        initializeApp(firebaseAdminConfig);
const firestoreInstance = getFirestore(app);
const resumeRoastCollection = firestoreInstance.collection("resumeRoast");
const resumeRoastCountCollection = firestoreInstance.collection("resumeRoastCount");
const resumeRoastCollectionV2 = firestoreInstance.collection("resumeRoastNew");
//remote config
const remoteConfig = env === 'development' ? null : getRemoteConfig(app);

export default {
    resumeRoastCollection,
    remoteConfig,
    resumeRoastCountCollection,
    resumeRoastCollectionV2,
};