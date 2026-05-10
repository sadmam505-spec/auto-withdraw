const axios = require('axios');
const http = require('http');

// আপনার ফায়ারবেস লিঙ্ক (সরাসরি নোড পর্যন্ত)
const firebase_base_url = "https://mypaymentapp-ef617-default-rtdb.firebaseio.com/LiveWithdrawals";

// রেন্ডার সার্ভার চালু রাখা
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Push-down system with Date & Time is running...');
}).listen(process.env.PORT || 3000);

async function sendData() {
    try {
        console.log("Fetching current data to re-order...");
        
        // ১. ফায়ারবেস থেকে বর্তমানের সব ডাটা নিয়ে আসা
        const response = await axios.get(`${firebase_base_url}.json`);
        let currentData = response.data || {};

        // ২. নতুন লিস্ট তৈরি (সবাইকে ১ ঘর নিচে পাঠানো)
        let updatedData = {};
        
        // নতুন ডাটা তৈরি (পজিশন ১ এর জন্য)
        const bdDateTime = new Date().toLocaleString('en-GB', { 
            timeZone: 'Asia/Dhaka', 
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', 
            hour12: true 
        });

        const randomIdPrefix = Math.floor(Math.random() * (811 - 134 + 1)) + 134;
        updatedData["1"] = {
            userId: `${randomIdPrefix}***`,
            amount: `$${Math.floor(Math.random() * (200 - 25 + 1)) + 25}.00`,
            status: "Paid",
            time: bdDateTime
        };

        // ৩. পুরনো ডাটাগুলোকে ২ থেকে ৩০ নম্বরে পাঠানো
        for (let i = 1; i < 30; i++) {
            if (currentData[i]) {
                updatedData[i + 1] = currentData[i];
            }
        }

        // ৪. পুরো লিস্টটি একবারে ফায়ারবেসে আপডেট করা
        await axios.put(`${firebase_base_url}.json`, updatedData);
        
        console.log(`Success! New data added at [1] on ${bdDateTime}`);

        // ৫. ১০-৩০ সেকেন্ডের র্যান্ডম বিরতি
        const randomDelay = Math.floor(Math.random() * (20 - 1 + 1)) + 1;
        console.log(`Waiting ${randomDelay} seconds...`);
        setTimeout(sendData, randomDelay * 1000);

    } catch (error) {
        console.error("Error occurred:", error.message);
        setTimeout(sendData, 10000);
    }
}

// স্টার্ট
sendData();
