const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const API_URL = 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json';

async function fetchDataAndSend() {
    try {
        const response = await axios.get(API_URL);
        const data = response.data.data.list;

        if (data) {
            const message = `
🔔 *New Result*
📝 Period: ${data.issueNumber}
🔢 Number: ${data.number}
📊 Size: ${data.number >= 5 ? 'Big' : 'Small'}
            `;

            await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            });
            console.log("Success: Data sent to Telegram!");
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
}

fetchDataAndSend();
