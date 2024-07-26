require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

let userInfo = {};

const token = process.env.TELEGRAM_BOT_TOKEN; // Telegram Bot Token
const url = process.env.WEBHOOK_URL; // Your local URL or Heroku URL
const port = process.env.PORT || 3000;
const bot = new TelegramBot(token, { polling: true });
// Error handling
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

// Start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  userInfo[chatId] = {}; // Initialize userInfo for the chat
  bot.sendMessage(chatId, 'Welcome! Let\'s get started with some basic information. What is your age?');
});

// Message handler
bot.on('message', (msg) => {
  const chatId = msg.chat.id;

  // Ensure userInfo[chatId] is initialized
  if (!userInfo[chatId]) {
    userInfo[chatId] = {};
  }

  if (!userInfo[chatId].age) {
    userInfo[chatId].age = msg.text;
    bot.sendMessage(chatId, 'Got it! What is your gender (male/female)?');
  } else if (!userInfo[chatId].gender) {
    userInfo[chatId].gender = msg.text;
    bot.sendMessage(chatId, 'Any allergies we should be aware of?');
  } else if (!userInfo[chatId].allergies) {
    userInfo[chatId].allergies = msg.text;
    bot.sendMessage(chatId, 'How do you specifically want to improve your health?');
  } else if (!userInfo[chatId].goal) {
    userInfo[chatId].goal = msg.text;
    bot.sendMessage(chatId, 'Thank you for the information. Generating your supplement recommendations...');
    generateRecommendations(chatId);
  }
});

// Function to generate supplement recommendations
function generateRecommendations(chatId) {
  const { age, gender, allergies, goal } = userInfo[chatId];

  // Example recommendations (you can replace this with real logic)
  const recommendations = [
    'Multivitamin',
    'Vitamin D',
    'Omega-3 Fish Oil',
    'Probiotic'
  ];

  let response = `Based on your information:
  - Age: ${age}
  - Gender: ${gender}
  - Allergies: ${allergies}
  - Health Goal: ${goal}

  We recommend the following supplements:
  - ${recommendations.join('\n- ')}`;

  bot.sendMessage(chatId, response);
}

console.log('Bot is running...');

//changed the versal nodejs version 20 to 18