const mongoose = require('mongoose');
require('dotenv').config();



const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('✅ DB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

dbConnect();

