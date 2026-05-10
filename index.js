const axios = require('axios');

// ১. আপনার ফায়ারবেস রিয়েলটাইম ডেটাবেজ URL (শেষে .json অবশ্যই দিবেন)
const firebase_url = "https://mypaymentapp-ef617-default-rtdb.firebaseio.com/LiveWithdrawals.json";

function generateProof() {
    // ২. র‍্যান্ডম আইডি (স্ক্রিনশটের মতো ফরমেট)
    const randomID = "ID: " + (Math.floor(Math.random() * 900) + 100) + "***";
    
    // ৩. র‍্যান্ডম অ্যামাউন্ট (আপনার দেওয়া স্ক্রিনশটের অ্যামাউন্টগুলো)
    const amounts = ["+$5.00", "+$12.50", "+$7.20", "+$3.00", "+$10.00", "+$2.50", "+$15.00"];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    
    // ৪. বর্তমান সময় (আপনার ডিজাইনের মতো: DD/MM/YY HH:mm:ss)
    const now = new Date();
    const formattedTime = now.toLocaleString("en-GB", { 
        timeZone: "Asia/Dhaka",
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    }).replace(',', '');

    const data = {
        userID: randomID,
        dateTime: formattedTime,
        amount: randomAmount,
        status: "PAID"
    };

    // ৫. ফায়ারবেসে ডেটা পুশ করা
    axios.post(firebase_url, data)
        .then(() => {
            console.log("Sent Success: " + randomID + " | Amount: " + randomAmount);
        })
        .catch(err => {
            console.log("Error logic: " + err.message);
        });

    // ৬. আপনার চাহিদা অনুযায়ী গ্যাপ (৫০০ms থেকে ১০০০ms)
    // অর্থাৎ সেকেন্ডে ১টা বা ২টা ডেটা যাবে
    const minDelay = 500; 
    const maxDelay = 1000;
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    setTimeout(generateProof, randomDelay);
}

// সিস্টেম স্টার্ট
generateProof();
