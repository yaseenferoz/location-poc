const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Import routes
const serviceStationRoutes = require('./routes/serviceStationRoutes');
app.use('/api/service-stations', serviceStationRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Server is running');
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.log('MongoDB Connection Failed:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
