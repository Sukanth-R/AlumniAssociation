const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/job')
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define the Job schema and model
const jobSchema = new mongoose.Schema({
  Jobtitle: { type: String, required: true },
  startdate: { type: String, required: true },  // Assume this is in 'YYYY-MM-DD' format
  Mode: { type: String, required: true },
  Location: { type: String, required: true },
  Companyname: { type: String, required: true },
  Description: { type: String, required: true }
});

const Job = mongoose.model('Job', jobSchema, 'job_details'); // Collection name: 'job_details'

// Define the API endpoint to fetch jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all job documents from the 'job_details' collection
    res.json(jobs); // Send jobs as a JSON response
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve "jobb.html" file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'jobb.html'));
});

// Function to delete jobs where startdate is today
async function deleteExpiredJobs() {
  const today = new Date().toISOString().split('T')[0]; // Get the current date in 'YYYY-MM-DD' format

  try {
    const result = await Job.deleteMany({ startdate: today });
  } catch (error) {
    console.error('Error deleting expired jobs:', error);
  }
}

// Schedule the deleteExpiredJobs function to run every second
setInterval(deleteExpiredJobs, 1000); // Runs every second

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
