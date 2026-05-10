const http = require('http');

// রেন্ডারকে শান্ত রাখার জন্য এই ৫ লাইন ম্যাজিকের মতো কাজ করবে
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is Active');
}).listen(process.env.PORT || 3000);

// এর নিচে আপনার আগের কোডটা যেমন ছিল ঠিক তেমনই থাকবে...
const axios = require('axios');
// বাকি সব আপনার আগের কোড...


const axios = require('axios');
const http = require('http');

// ১. আপনার ফায়ারবেস লিঙ্ক
const firebase_url = "https://mypaymentapp-ef617-default-rtdb.firebaseio.com/LiveWithdrawals.json";

// রেন্ডার যাতে বন্ধ না করে দেয় তার জন্য একটি ছোট সার্ভার
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running...');
}).listen(process.env.PORT || 3000);

function sendData() {
    // ২. ১৩৪ থেকে ৮১১ এর মধ্যে র্যান্ডম ইউজার আইডি
    const randomIdPrefix = Math.floor(Math.random() * (811 - 134 + 1)) + 134;
    const userId = `${randomIdPrefix}***`;

    // ৩. ২৫ থেকে ৫০০ এর মধ্যে র্যান্ডম ডলার
    const amount = Math.floor(Math.random() * (500 - 25 + 1)) + 25;

    const data = {
        userId: userId,
        amount: `$${amount}.00`,
        status: "Paid",
        time: new Date().toLocaleTimeString()
    };

    axios.post(firebase_url, data)
        .then(response => {
            console.log(`Sent Success: ID: ${userId} | Amount: $${amount} | Status: Paid`);
            
            // ৪. ১০ থেকে ৩০ সেকেন্ডের মধ্যে র্যান্ডম বিরতি
            const randomDelay = Math.floor(Math.random() * (30 - 10 + 1)) + 10;
            console.log(`Waiting for ${randomDelay} seconds...`);
            
            setTimeout(sendData, randomDelay * 1000);
        })
        .catch(error => {
            console.error("Error:", error.message);
            setTimeout(sendData, 5000);
        });
}

// রান করা হলো
sendData();
