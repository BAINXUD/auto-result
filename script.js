const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const API_URL = 'https://draw.ar-lottery01.com/WinGo/WinGo_30S/GetHistoryIssuePage.json';

async function fetchDataAndSend() {
    try {
        console.log("Checking API...");
        const response = await axios.get(API_URL);
        
        // পুরো রেসপন্স চেক করা
        if (response.data && response.data.data && response.data.data.list) {
            const data = response.data.data.list;
            console.log("Data found:", data.issueNumber);

            const message = `
🔔 *New Result Found!*
📝 Period: ${data.issueNumber}
🔢 Number: ${data.number}
📊 Size: ${data.number >= 5 ? 'Big' : 'Small'}
            `;

            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
            
            const res = await axios.post(telegramUrl, {
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            });

            if(res.data.ok) {
                console.log("Message sent to Telegram successfully!");
            } else {
                console.log("Telegram API Error:", res.data);
            }
        } else {
            console.log("No data found in API response.");
        }
    } catch (error) {
        console.error("Error Details:", error.response ? error.response.data : error.message);
    }
}

fetchDataAndSend();
