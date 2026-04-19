const cloudscraper = require('cloudscraper');
const axios = require('axios'); // টেলিগ্রামের জন্য লাগবে

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const API_URL = 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json';

async function fetchDataAndSend() {
    console.log("Attempting to bypass Cloudflare...");
    
    cloudscraper.get(API_URL, async function(error, response, body) {
        if (error) {
            console.error('Error occurred:', error.message);
        } else {
            try {
                const jsonData = JSON.parse(body);
                if (jsonData && jsonData.data && jsonData.data.list) {
                    const data = jsonData.data.list;
                    console.log("Success! Data found:", data.issueNumber);

                    const message = `
🔔 *New Result Found!*
📝 Period: ${data.issueNumber}
🔢 Number: ${data.number}
📊 Size: ${data.number >= 5 ? 'Big' : 'Small'}
                    `;

                    await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                        chat_id: CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    });
                    console.log("Message sent to Telegram!");
                }
            } catch (e) {
                console.log("Could not parse JSON. The server might still be showing a challenge page.");
                console.log("Response starts with:", body.substring(0, 100));
            }
        }
    });
}

fetchDataAndSend();
