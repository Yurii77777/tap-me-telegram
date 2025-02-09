require('dotenv').config();
const { Telegraf } = require('telegraf');

const token = process.env.TG_BOT_TOKEN;

export const bot = new Telegraf(token);
