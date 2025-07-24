const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('🚀 MongoDB connected successfully!');
    app.listen(process.env.PORT, () =>
      console.log(`🌍 Skoolly API running on http://localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ MongoDB Error:', err));
