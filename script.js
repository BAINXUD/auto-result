const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const API_URL = 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json';

async function fetchDataAndSend() {
    try {
        console.log("Checking API with browser headers...");
        
        const response = await axios.get(API_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Referer': 'https://draw.ar-lottery01.com/',
                'Origin': 'https://draw.ar-lottery01.com'
            }
        });

        if (response.data && response.data.data && response.data.data.list) {
            const data = response.data.data.list;
            console.log("Data found for Period:", data.issueNumber);

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
        } else {
            console.log("Response received but no list data found.");
        }
    } catch (error) {
        if (error.response && error.response.status === 403) {
            console.log("Error 403: Server blocked the request (Cloudflare protection).");
        } else {
            console.error("Error Details:", error.message);
        }
    }
}

fetchDataAndSend();
