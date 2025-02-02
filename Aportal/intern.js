const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const querystring = require('querystring');
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

const app = express();
const PORT = 7002;

// Connect to MongoDB
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

// Route to handle form submission
app.post('/insert', async (req, res) => {
    try {
        const db = client.db('intern');
        const collection = db.collection('intern_details');

        // Parse form data
        const data = {
            Email:req.body.email,
            jobTitle: req.body.jobTitle,
            startDate: req.body.startDate,
            duration: req.body.duration,
            companyName: req.body.companyName,
            location: req.body.location,
            mode:req.body.mode,
            internCount:req.body.internCount,
            amount:req.body.amount
        };

        // Insert the data into the MongoDB collection
        const result = await collection.insertOne(data);
        console.log("Document inserted:", result.insertedCount);

        // Send the HTML response
        res.send(`
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
                            Intern posted successfully!
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
