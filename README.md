# Local setup:

To set up:
1. nodemon app.js
2. ngrok http 3000

After, we go to [our app](https://discord.com/developers/applications/1135725519783071774/information) and add the ngrok link, appended with /interactions.

You will also need to have a .env file locally with the following keys:
1. APP_ID
2. DISCORD_TOKEN
3. PUBLIC_KEY
4. OPENAI_API_KEY