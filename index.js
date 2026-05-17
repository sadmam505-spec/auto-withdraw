const axios = require('axios');
const http = require('http');

// ফায়ারবেজ ইউআরএল
const firebase_base_url = "https://mypaymentapp-ef617-default-rtdb.firebaseio.com/LiveWithdrawals";

// রেন্ডার সার্ভার পোর্ট লিসেনিং
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('System is Live with Universal Timestamp & Points Config...');
}).listen(process.env.PORT || 3000);

/**
 * নতুন প্রবাবিলিটি লজিক অনুযায়ী পয়েন্ট (PTS) জেনারেশন
 * ৫০০ এর ঘর হিসেবে বাড়বে (যেমন: ২৫০০০, ২৫৫০০, ৪০৫০০...)
 */
function getRandomPoints() {
    const chance = Math.random() * 100;
    let amount = 0;

    if (chance <= 40) {
        // ২৫,০০০ থেকে ৫০,০০০ পর্যন্ত (৪০% চান্স)
        // লজিক: রেঞ্জকে ৫০০ দিয়ে ভাগ করে র্যান্ডম স্টেপ বের করে আবার ৫০০ দিয়ে গুণ
        const min = 25000;
        const max = 50000;
        const steps = Math.floor(Math.random() * ((max - min) / 500 + 1));
        amount = min + (steps * 500);
    } else {
        // ৫০,৫০০ থেকে ২,০০,০০০ পর্যন্ত (৬০% চান্স)
        const min = 50500;
        const max = 200000;
        const steps = Math.floor(Math.random() * ((max - min) / 500 + 1));
        amount = min + (steps * 500);
    }
    
    // ইন্টারন্যাশনাল স্টাইলে কমা ফরম্যাট সহ রিটার্ন (উদা: 45,500 PTS)
    return `${amount.toLocaleString()} pts`;
}

async function sendData() {
    try {
        console.log("Fetching current dashboard data...");
        const response = await axios.get(`${firebase_base_url}.json`);
        let currentData = response.data || {};

        let updatedData = {};
        
        // ইউনিভার্সাল টাইমস্ট্যাম্প (কোনো পরিবর্তন করা হয়নি)
        const timestamp = new Date().getTime(); 
        
        // ১ নম্বর পজিশনে নতুন ডাটা (UserId সম্পূর্ণ রিমুভড)
        updatedData["1"] = {
            amount: getRandomPoints(),
            status: "Paid",
            time: timestamp
        };

        // পুরনো ডাটাগুলোকে এক ঘর করে নিচে নামানো (ম্যাক্সিমাম ৩০টি ডাটা)
        Object.keys(currentData).forEach(key => {
            let currentPos = parseInt(key);
            if (currentPos >= 1 && currentPos < 30) {
                updatedData[(currentPos + 1).toString()] = currentData[key];
            }
        });

        // ফায়ারবেজে নতুন স্লট পুশ ও আপডেট
        await axios.put(`${firebase_base_url}.json`, updatedData);
        console.log(`Success! Live Proof Synced at: ${timestamp} -> ${updatedData["1"].amount}`);

        // ১০ থেকে ৩০ সেকেন্ডের মধ্যে র্যান্ডম ইন্টারভালে আবার রান হবে
        const randomDelay = Math.floor(Math.random() * (17 - 1 + 1)) + 1;
        setTimeout(sendData, randomDelay * 1000);

    } catch (error) {
        console.error("Firebase Sync Error:", error.message);
        setTimeout(sendData, 10000); // এরর খেলে ১০ সেকেন্ড পর আবার ট্রাই করবে
    }
}

// ইঞ্জিন স্টার্ট
sendData();
