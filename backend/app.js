const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/auth', require('./routes/auth.routes'));
app.use('/admin', require('./routes/admin.routes'));
app.use('/schools', require('./routes/school.routes'));
app.use('/sessions', require('./routes/session.routes'));
app.use('/terms', require('./routes/term.routes'));
app.use('/classes', require('./routes/class.routes'));


app.get('/', (req, res) => res.send('🌍 Skoolly API up & running!'));



module.exports = app;