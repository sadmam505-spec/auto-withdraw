const axios = require('axios');
const http = require('http');

// ১. আপনার ফায়ারবেস লিঙ্ক
const firebase_url = "https://mypaymentapp-ef617-default-rtdb.firebaseio.com/LiveWithdrawals.json";

// রেন্ডার যাতে বন্ধ না হয় তার জন্য সার্ভার
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running with BD Date & Time...');
}).listen(process.env.PORT || 3000);

function sendData() {
    const randomIdPrefix = Math.floor(Math.random() * (811 - 134 + 1)) + 134;
    const userId = `${randomIdPrefix}***`;
    const amount = Math.floor(Math.random() * (500 - 25 + 1)) + 25;

    // ২. বাংলাদেশের তারিখ ও সময় একসাথে সেট করা হয়েছে এখানে
    const bdDateTime = new Date().toLocaleString('en-GB', { 
        timeZone: 'Asia/Dhaka', 
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: true 
    });

    const data = {
        userId: userId,
        amount: `$${amount}.00`,
        status: "Paid",
        time: bdDateTime // এখানে তারিখ এবং সময় একসাথে যাবে
    };

    axios.post(firebase_url, data)
        .then(response => {
            console.log(`Sent Success: ID: ${userId} | DateTime: ${bdDateTime}`);
            
            // ৩. ১০ থেকে ৩০ সেকেন্ডের মধ্যে র্যান্ডম বিরতি
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
