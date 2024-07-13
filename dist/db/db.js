"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const remote_config_1 = require("firebase-admin/remote-config");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
let regularObj = {};
const env = process.env.NODE_ENV;
if (env === 'development') {
    const FIRESTORE_EMULATOR_HOST = process.env.FIRESTORE_EMULATOR_HOST;
}
Object.assign(regularObj, serviceAccount);
const firebaseAdminConfig = {
    credential: (0, app_1.cert)(regularObj)
};
const app = (0, app_1.getApps)().length > 0 ? (0, app_1.getApp)() :
    env === 'development' ? (0, app_1.initializeApp)({
        projectId: "roast-my-resume",
        credential: firebaseAdminConfig.credential,
    }) :
        (0, app_1.initializeApp)(firebaseAdminConfig);
const firestoreInstance = (0, firestore_1.getFirestore)(app);
const resumeRoastCollection = firestoreInstance.collection("resumeRoast");
const resumeRoastCountCollection = firestoreInstance.collection("resumeRoastCount");
const resumeRoastCollectionV2 = firestoreInstance.collection("resumeRoastNew");
//remote config
const remoteConfig = env === 'development' ? null : (0, remote_config_1.getRemoteConfig)(app);
exports.default = {
    resumeRoastCollection,
    remoteConfig,
    resumeRoastCountCollection,
    resumeRoastCollectionV2,
};
//# sourceMappingURL=db.js.map