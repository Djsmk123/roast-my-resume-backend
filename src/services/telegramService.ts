import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv';
import { constants } from "../utils/constant";
import parsePDF from "../utils/pdf-text-extractor";
import roastHelper from "./roastHelper";

dotenv.config();

// Get the Telegram token from environment variables
const token = process.env.TELEGRAM_TOKEN;

// Create a new instance of the Telegram bot
const bot = new TelegramBot(token, { polling: true });

// Store user sessions
const userSessions: { [key: number]: any } = {};

// Handle polling errors
bot.on("polling_error", console.log);
bot.on("webhook_error", console.log);

// Handle the /start command
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const startMessage = `
        Welcome to Roast My Resume!
        /help - Get a list of commands
        /start - Start the bot

        Now, use the /roast or /roastLinkedIn command to get your resume or LinkedIn profile roasted!
        Disclaimer: This bot is for entertainment purposes only. The roasts generated are not meant to be taken seriously.

        Note: Please do not store your resume text on databases or any other storage. We do keep only generated roast and meme for sharing and bot improvement purposes.
    `;
    await bot.sendMessage(chatId, startMessage);
});

// Handle the /help command
bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const text = `
        Welcome to the Roast My Resume bot! Here are the commands you can use: 

        1. /roast <RoastLevel> <Role> <Language> [meme]
           - RoastLevel:
             - 0 = Soft-hearted
             - 1 = Hard-hearted
             - 2 = Light
             - 3 = Dark
             - 4 = Vulgar
           - Role:
             - 0 = Memer
             - 1 = Job Interviewer
             - 2 = Standup Comedian
             - 3 = HR
             - 4 = Friend
             - 5 = Family Member
             - 6 = Boss
             - 7 = Teacher
             - 8 = Enemy
             - 9 = Girlfriend
             - 10 = Boyfriend
           - Language:
             - 0 = English
             - 1 = Hindi
             - 2 = Both Hindi and English
           - Meme (optional): To include a meme in the roast, add "meme" at the end of the command.
        
        Example without meme:
        /roast 3 3 0

        Example with meme:
        /roast 3 3 0 meme

        2. /roastLinkedIn <RoastLevel> <Role> <Language> <LinkedIn Profile URL> [meme]
           - RoastLevel:
             - 0 = Soft-hearted
             - 1 = Hard-hearted
             - 2 = Light
             - 3 = Dark
             - 4 = Vulgar
           - Role:
             - 0 = Memer
             - 1 = Job Interviewer
             - 2 = Standup Comedian
             - 3 = HR
             - 4 = Friend
             - 5 = Family Member
             - 6 = Boss
             - 7 = Teacher
             - 8 = Enemy
             - 9 = Girlfriend
             - 10 = Boyfriend
           - Language:
             - 0 = English
             - 1 = Hindi
             - 2 = Both Hindi and English
           - LinkedIn Profile URL: Provide the URL of the LinkedIn profile you want to roast.
           - Meme (optional): To include a meme in the roast, add "meme" at the end of the command.
        
        Example without meme:
        /roastLinkedIn 3 3 0 https://www.linkedin.com/in/md-mobin-bb928820b/

        Example with meme:
        /roastLinkedIn 3 3 0 https://www.linkedin.com/in/md-mobin-bb928820b/ meme

        Disclaimer: This bot is for entertainment purposes only. The roasts generated are not meant to be taken seriously.
    `;
    await bot.sendMessage(chatId, text);
});


// Handle the /roast command
bot.onText(/\/roast (\d) (\d+) (\d+)( meme)?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const roastLevel = parseInt(match[1]);
    const role = parseInt(match[2]);
    const language = parseInt(match[3]);
    const meme = match[4] ? true : false;

    // Check if the roast level, role, and language are valid
    if (isNaN(roastLevel) || roastLevel < 0 || roastLevel > 4) {
        await bot.sendMessage(chatId, "Invalid roast level. Please use a number between 0 and 4.");
        return;
    }
    if (isNaN(role) || role < 0 || role > 10) {
        await bot.sendMessage(chatId, "Invalid role. Please use a number between 0 and 10.");
        return;
    }
    if (isNaN(language) || language < 0 || language > 2) {
        await bot.sendMessage(chatId, "Invalid language. Please use a number between 0 and 2.");
        return;
    }

    // Save the roast parameters in the user session
    userSessions[chatId] = { roastLevel, role, language, meme };

    await bot.sendMessage(chatId, "Great! Now please upload your resume PDF file.");
});

// Handle document uploads
bot.on("document", async (msg) => {
    const chatId = msg.chat.id;

    // Check if we are waiting for a document from this user
    if (!userSessions[chatId]) {
        await bot.sendMessage(chatId, "Please use the /roast command first to specify the roast parameters.");
        return;
    }

    const fileId = msg.document.file_id;
    const filePath = await bot.getFileLink(fileId);

    // Check if file is valid PDF
    if (!filePath.endsWith(".pdf")) {
        await bot.sendMessage(chatId, "Invalid file. Please upload a PDF file.");
        return;
    }

    const { roastLevel, role, language, meme } = userSessions[chatId];

    const tone = Object.values(constants.Tones)[roastLevel];
    const roleType = Object.values(constants.Roles)[role];
    const languageType = Object.values(constants.Languages)[language];
    await bot.sendMessage(chatId, "Processing your request could take a few seconds... Please wait");

    try {
        // Parse PDF
        const resumeText = await parsePDF({ buffer: null, url: filePath });
        if (!resumeText) {
            await bot.sendMessage(chatId, "Error parsing PDF file. Please try again.");
            return;
        }

        // Generate roast
        const response = await roastHelper.roastHelper({
            roastTone: tone,
            roleType,
            languageType,
            text: resumeText,
            hasMeme: meme == "true",
            entity: "Resume",
        });
        if (!response) {
            await bot.sendMessage(chatId, "Error generating roast. Please try again.");
            return;
        }

        const message = `We have a new roast from Roast My Resume!.Check it out below: \n\n${response.roast} \n\nCheck it out below: \n\nhttps://roast-my-resume-henna.vercel.app/roast?id=${response.id}\n\n`;
        await bot.sendMessage(chatId, message);

        if (response.meme) {
            await bot.sendMessage(chatId, `We also have a meme for you!\n${response.meme.output}`);
        }

    } catch (error) {
        await bot.sendMessage(chatId, "An error occurred while processing your request. Please try again.");
    }

    // Clear the user session
    delete userSessions[chatId];
});

//on linkedInRoast /roastLinkedIn 3 3 0 <LinkedIn Profile URL> meme
bot.onText(/\/roastLinkedIn (\d) (\d+) (\d+) (.+)( meme)?/, async (msg, match) => {
    const chatId = msg.chat.id;
    console.log(chatId);
    try {

        const roastLevel = parseInt(match[1]);
        const role = parseInt(match[2]);
        const language = parseInt(match[3]);
        const linkedInProfile = match[4];
        const meme = match[5] ? true : false;

        // Check if the roast level, role, and language are valid
        if (isNaN(roastLevel) || roastLevel < 0 || roastLevel > 4) {
            await bot.sendMessage(chatId, "Invalid roast level. Please use a number between 0 and 4.");
            return;
        }
        if (isNaN(role) || role < 0 || role > 10) {
            await bot.sendMessage(chatId, "Invalid role. Please use a number between 0 and 10.");
            return;
        }
        if (isNaN(language) || language < 0 || language > 2) {
            await bot.sendMessage(chatId, "Invalid language. Please use a number between 0 and 2.");
            return;
        }
        const roastTone = Object.values(constants.Tones)[roastLevel];
        const roleType = Object.values(constants.Roles)[role];
        const languageType = Object.values(constants.Languages)[language];


        await bot.sendMessage(chatId, "Great! Now please wait while we roast your LinkedIn profile.");
        const linkedInProfileData = await roastHelper.getLinkedInProfile(linkedInProfile);
        if (!linkedInProfileData) {
            await bot.sendMessage(chatId, "Invalid LinkedIn profile. Please try again.");
            return;
        }

        const resonse = await roastHelper.roastHelper({
            roastTone,
            roleType,
            languageType,
            text: "Profile: " + JSON.stringify(linkedInProfileData),
            hasMeme: meme,
            entity: "My Linked Profile",
        });
        if (!resonse) {
            await bot.sendMessage(chatId, "Error generating roast. Please try again.");
            return;
        }
        const message = `We have a new roast of your profile from Roast My Resume!.Check it out below: \n\n${resonse.roast} \n\nCheck it out below: \n\nhttps://roast-my-resume-henna.vercel.app/roast?id=${resonse.id}\n\n`;
        await bot.sendMessage(chatId, message);
    } catch (e) {
        console.log(e);
        await bot.sendMessage(chatId, "An error occurred while processing your request. Please try again.");
    }

});

export default bot;
