const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = 2009;

// Middleware
app.use(express.json()); // Use express built-in JSON parser
app.use(cors()); // Handle CORS issues
app.use(express.static('public')); // Serve static files
app.use(bodyParser.json()); // Parse incoming request bodies in JSON format

// Connect to MongoDB using Mongoose
mongoose.connect('mongodb://localhost:27017/alumni', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));


const announcementSchema = new mongoose.Schema({
    title: String,
    startDate: String,
    description: String
});
const Announcement = mongoose.model('Announcement', announcementSchema);


app.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find();
        res.status(200).json(announcements);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching announcements' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
