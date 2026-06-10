require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'CRM API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
