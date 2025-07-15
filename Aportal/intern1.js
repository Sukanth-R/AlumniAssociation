const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3001;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/intern')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define the Intern schema and model
const internSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  startDate: { type: String, required: true }, // Assuming this is in 'YYYY-MM-DD' format
  duration: { type: String, required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  mode: { type: String, required: true },
  internCount: { type: String, required: true },
  amount: { type: String, required: true }
});

const Intern = mongoose.model('Intern', internSchema, 'intern_details'); // Collection name: 'intern_details'

// Define the API endpoint to fetch interns
app.get('/api/interns', async (req, res) => {
  try {
    const interns = await Intern.find(); // Fetch all intern documents from the 'intern_details' collection
    res.json(interns); // Send interns as a JSON response
  } catch (error) {
    console.error('Error fetching intern data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve "intern.html" file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'intern.html'));
});

// Function to delete records where startDate is today
async function deleteExpiredInterns() {
  const today = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format

  try {
    const result = await Intern.deleteMany({ startDate: today });
  } catch (error) {
    console.error('Error deleting expired interns:', error);
  }
}

// Schedule the deleteExpiredInterns function to run every second
setInterval(deleteExpiredInterns, 1000); // Runs every second

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
