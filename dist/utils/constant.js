"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constants = void 0;
const generative_ai_1 = require("@google/generative-ai");
var Tones;
(function (Tones) {
    Tones["SoftHearted"] = "soft-hearted";
    Tones["HardHearted"] = "hard-hearted";
    Tones["Light"] = "light";
    Tones["Dark"] = "dark";
    Tones["Vulgar"] = "vulgar";
})(Tones || (Tones = {}));
var Roles;
(function (Roles) {
    Roles["Memer"] = "Memer";
    Roles["JobInterviewer"] = "Job Interviewer";
    Roles["StandupComedian"] = "Standup Comedian";
    Roles["HR"] = "HR";
    Roles["Friend"] = "Friend";
    Roles["FamilyMember"] = "Family Member";
    Roles["AshneerGrover"] = "Ashneer Grover";
    Roles["Teacher"] = "Teacher";
    Roles["Enemy"] = "Enemy";
    Roles["Girlfriend"] = "Girlfriend";
    Roles["Boyfriend"] = "Boyfriend";
})(Roles || (Roles = {}));
var Languages;
(function (Languages) {
    Languages["English"] = "English";
    Languages["Hindi"] = "Hindi";
    Languages["BothHindiAndEnglish"] = "Both Hindi and English";
})(Languages || (Languages = {}));
const safetySettings = [
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE },
    { category: generative_ai_1.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: generative_ai_1.HarmBlockThreshold.BLOCK_NONE },
];
exports.constants = {
    Tones,
    Roles,
    Languages,
    safetySettings,
};
//# sourceMappingURL=constant.js.map