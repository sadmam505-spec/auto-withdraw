const axios = require('axios');

// আপনার ফায়ারবেস লিঙ্কটি এখানে বসান (লিঙ্কের শেষে .json থাকতে হবে)
const firebase_url = "https://mypaymentapp-ef617-default-rtdb.firebaseio.com/LiveWithdrawals.json";

function sendData() {
    // ১. ১৩৪ থেকে ৮১১ এর মধ্যে র্যান্ডম ইউজার আইডি তৈরি
    const randomIdPrefix = Math.floor(Math.random() * (811 - 134 + 1)) + 134;
    const userId = `${randomIdPrefix}***`;

    // ২. ২৫ থেকে ৫০০ এর মধ্যে র্যান্ডম ডলার অ্যামাউন্ট তৈরি
    const amount = Math.floor(Math.random() * (500 - 25 + 1)) + 25;

    const data = {
        userId: userId,
        amount: `$${amount}.00`,
        status: "Paid", // এখানে 'Success' এর বদলে 'Paid' করে দিলাম
        time: new Date().toLocaleTimeString()
    };

    axios.post(firebase_url, data)
        .then(response => {
            console.log(`Sent Success: ID: ${userId} | Amount: $${amount} | Status: Paid`);
            
            // ৩. ১০ থেকে ৫০ সেকেন্ডের মধ্যে র্যান্ডম বিরতি (Random Delay)
            const randomDelay = Math.floor(Math.random() * (50 - 10 + 1)) + 10;
            console.log(`Waiting for ${randomDelay} seconds before next entry...`);
            
            setTimeout(sendData, randomDelay * 1000);
        })
        .catch(error => {
            console.error("Error sending data:", error.message);
            setTimeout(sendData, 5000);
        });
}

sendData();
