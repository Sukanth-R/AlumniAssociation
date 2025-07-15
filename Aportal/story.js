var http = require('http');
var url = require('url');
var fs = require('fs');  // Add the fs module to read files
var path = require('path');  // To handle file paths
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var uri = 'mongodb://localhost:27017/';
var client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectDB();

async function onRequest(req, res) {
    var pathname = url.parse(req.url).pathname;

    // Serve static files (like images)
    if (pathname === '/t1.webp') {
        var filePath = path.join(__dirname, 'public', 't1.webp');  // Correct the path

        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Image not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'image/webp' });
                res.end(data);  // Serve the image file
            }
        });
    } else if (pathname === '/submit_story') {
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', async () => {
                try {
                    var qs = querystring.parse(body);
                    await insert(req, res, qs);
                } catch (err) {
                    console.error("Error handling request data:", err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                }
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'text/plain' });
            res.end('Method Not Allowed');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

async function insert(req, res, qs) {
    try {
        var db = client.db('story');
        var collection = db.collection('story_details');

        var data = {
            Email: qs["email"],
            storyTitle: qs["title"],
            alumniName: qs["alumni_name"],
            graduationYear: qs["grad_year"],
            storyDescription: qs["story_description"]
        };

        var result = await collection.insertOne(data);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Story Submitted</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                <style>
                    .alert-container {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        text-align: center;
                        margin-top: 5rem;
                    }
                    .alert {
                        font-size: 50px;
                        color: #002366;
                        font-style: bold;
                    }
                    img {
                        width: 150px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="alert-container">
                        <img src="/t1.webp" alt="Success">
                        <div class="alert" role="alert">
                            Story submitted successfully!
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
}

http.createServer(onRequest).listen(5000);
console.log('Server is running on port 5000...');
