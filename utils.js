import 'dotenv/config';
import OpenAI from 'openai';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭', '😄', '😌', '🤓', '😎', '😤', '🤖', '😶‍🌫️', '🌏', '📸', '💿', '👋', '🌊', '✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export async function getFortniteLocation() {
  const locationList = [
    'Anvil Square',
    'Breakwater Bay',
    'Brutal Bastion',
    'Faulty Splits',
    'Lonely Labs',
    'Shattered Slabs',
    'Slappy Shores',
    'The Citadel',
    'MEGA City',
    'Steamy Springs',
    'Kenjutsu Crossing',
    'Knotty Nets',
    'Shady Stilts',
    'Creeky Compound',
    'Rumble Ruins',]

  let selectedLocation = locationList[Math.floor(Math.random() * locationList.length)]

  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: "In between 10 and 35 words, let the user they will be dropping " + selectedLocation + " in Fortnite. Feel free to insult the location based on the specific traits of the location, and/or the player. Don't use exclamation points. Feel free to answer like a cowboy, australian, or otherwise wacky character." }],
    model: 'gpt-3.5-turbo',
  });

  return completion.choices[0]['message']['content'];
}

export async function getChatResponse(userQuery) {
  const completion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: userQuery }],
    model: 'gpt-3.5-turbo',
  });

  return completion.choices[0]['message']['content']
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
