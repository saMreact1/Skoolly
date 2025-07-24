const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/auth', require('./routes/auth.routes'));
// app.use('/users', require('./routes/user.routes'));

app.get('/', (req, res) => res.send('🌍 Skoolly API up & running!'));



module.exports = app;