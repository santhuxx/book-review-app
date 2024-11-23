const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with React app URL
  credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());

// Routes
const reviewRoutes = require('./routes/reviewRoutes');
const UserRoutes = require('./routes/userRoutes');

app.use('/api/reviews', reviewRoutes);
app.use('/auth', UserRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));