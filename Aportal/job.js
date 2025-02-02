const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb://localhost:27017/';
const client = new MongoClient(uri);

const app = express();
const PORT = 7001;

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectDB();

app.use(express.static('public')); // Serve static files from 'public' directory

app.use(express.urlencoded({ extended: true }));

app.post('/insert', async (req, res) => {
    try {
        const db = client.db('job');
        const collection = db.collection('job_details');

        const data = {
            Email:req.body.email,
            Jobtitle: req.body.jobTitle,
            startdate: req.body.startDate,
            Mode: req.body.mode,
            Location: req.body.location,
            Companyname: req.body.companyName,
            Description: req.body.description
        };

        const result = await collection.insertOne(data);
        console.log("Document inserted:", result.insertedCount);

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
            font-style:bold;
        }
        img {
            width: 150px; /* Adjust image size as needed */
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="alert-container">
            <img src="t.webp" alt="Success">
            <div class="alert" role="alert">
                Job posted successfully!
            </div>
        </div>
    </div>
</body>
</html>

        `);
    } catch (error) {
        
        console.error("Error inserting document:", error);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error inserting document');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
