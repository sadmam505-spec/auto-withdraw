const axios = require('axios');
const http = require('http');

// ফায়ারবেজ ইউআরএল
const firebase_base_url = "https://mypaymentapp-ef617-default-rtdb.firebaseio.com/LiveWithdrawals";

// রেন্ডার সার্ভার পোর্ট লিসেনিং
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('System is Live with Universal Timestamp...');
}).listen(process.env.PORT || 3000);

// প্রবাবিলিটি লজিক অনুযায়ী এমাউন্ট জেনারেশন
function getRandomAmount() {
    const chance = Math.random() * 100;
    let amount = 0;

    if (chance <= 40) {
        amount = Math.floor(Math.random() * (40 - 25 + 1)) + 25; // 25-40
    } else if (chance <= 70) {
        amount = Math.floor(Math.random() * (100 - 41 + 1)) + 41; // 41-100
    } else if (chance <= 90) {
        amount = Math.floor(Math.random() * (250 - 101 + 1)) + 101; // 101-250
    } else {
        amount = Math.floor(Math.random() * (1000 - 251 + 1)) + 251; // 251-1000
    }
    return `$${amount}.00`;
}

async function sendData() {
    try {
        console.log("Fetching data...");
        const response = await axios.get(`${firebase_base_url}.json`);
        let currentData = response.data || {};

        let updatedData = {};
        
        // এখন আমরা কোনো নির্দিষ্ট স্ট্রিং না পাঠিয়ে সরাসরি মিলিসেকেন্ড পাঠাচ্ছি
        const timestamp = new Date().getTime(); 

        const randomIdPrefix = Math.floor(Math.random() * (811 - 134 + 1)) + 134;
        
        // ১ নম্বর পজিশনে নতুন ডাটা
        updatedData["1"] = {
            userId: `${randomIdPrefix}***`,
            amount: getRandomAmount(),
            status: "Paid",
            time: timestamp // এখানে সংখ্যা হিসেবে টাইম সেভ হবে (উদা: 1715386988885)
        };

        // পুরনো ডাটাগুলোকে এক ঘর করে নিচে নামানো
        Object.keys(currentData).forEach(key => {
            let currentPos = parseInt(key);
            if (currentPos >= 1 && currentPos < 30) {
                updatedData[(currentPos + 1).toString()] = currentData[key];
            }
        });

        // ফায়ারবেজে আপডেট
        await axios.put(`${firebase_base_url}.json`, updatedData);
        console.log(`Success! New Payment at timestamp: ${timestamp}`);

        // ১০ থেকে ৩০ সেকেন্ডের মধ্যে র্যান্ডম বিরতি
        const randomDelay = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
        setTimeout(sendData, randomDelay * 1000);

    } catch (error) {
        console.error("Error:", error.message);
        setTimeout(sendData, 10000);
    }
}

sendData();
