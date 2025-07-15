const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const querystring = require('querystring');
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

const app = express(); // Initialize Express app
const PORT = 1000; // Port number

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectDB();

// Middleware to serve static files from 'public' directory
app.use(express.static('public')); // Make sure the 'public' directory contains your static files like 't1.webp'

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Handle the POST request for '/submit_mentor_details'
app.post('/submit_mentor_details', async (req, res) => {
    try {
        const db = client.db('mentor');  // Database name
        const collection = db.collection('mentor_details');  // Collection name

        // Prepare data for insertion
        const data = {
            name:req.body.name,
            email: req.body.email,
            domain: req.body.domain,
            mentees: parseInt(req.body.mentees, 10), // Convert to integer
            availability: {
                fromDate: req.body["from-date"],
                toDate: req.body["to-date"],
                startTime: req.body["start-time"],
                endTime: req.body["end-time"]
            },
            linkedin: req.body.linkedin,
            fee: parseFloat(req.body.amount) // Convert to float
        };

        // Insert the document into the collection
        const result = await collection.insertOne(data);

        // Send success response
        res.status(200).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Job Posted</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    .alert-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        margin-top: 5rem; /* Adjust as needed */
                    }
                    .alert {
                        font-size: 50px;
                        color: #002366;
                        font-style: bold;
                    }
                    img {
                        width: 150px; /* Adjust image size as needed */
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="alert-container">
                        <img src="t1.webp" alt="Success"> <!-- Image served from 'public' directory -->
                        <div class="alert" role="alert">
                            Mentorship posted successfully!
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `);
    } catch (error) {
        console.error("Error inserting document:", error);
        res.status(500).send('Error inserting document');
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
