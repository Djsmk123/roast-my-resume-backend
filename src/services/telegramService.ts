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
        ...
    `;
    await bot.sendMessage(chatId, startMessage);
});

// Handle the /help command
bot.onText(/\/help/, async (msg) => {
    const chatId = msg.chat.id;
    const text = `
        Welcome to the Roast My Resume bot! Here are the commands you can use:
        ...
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

    try {
        // Parse PDF
        const resumeText = await parsePDF({ buffer: null, url: filePath });
        if (!resumeText) {
            await bot.sendMessage(chatId, "Error parsing PDF file. Please try again.");
            return;
        }

        // Generate roast
        const response = await roastHelper({
            roastTone: tone,
            roleType,
            languageType,
            resumeText,
            hasMeme: meme
        });
        if (!response) {
            await bot.sendMessage(chatId, "Error generating roast. Please try again.");
            return;
        }

        const message = `We have a new roast from Roast My Resume!. Check it out below:\n\n${response.roast}\n\nCheck it out below:\n\nhttps://roast-my-resume-henna.vercel.app/roast?id=${response.id}\n\n`;
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

export default bot;
