const { spawn } = require('child_process');
const path = require('path');

// Relative paths to local server files
const servers = [path.join(__dirname, 'db.js'), path.join(__dirname, 'eve.js'),, path.join(__dirname, 'intern.js'),, path.join(__dirname, 'intern1.js'),, path.join(__dirname, 'job.js'),, path.join(__dirname, 'mentor.js'),, path.join(__dirname, 'server.js'),, path.join(__dirname, 'web.js'),, path.join(__dirname, 'story.js')];

servers.forEach((file) => {
  const child = spawn('node', [file]);

  child.stdout.on('data', (data) => {
    console.log(`[${file}] ${data}`);
  });

  child.stderr.on('data', (data) => {
    console.error(`[${file} ERROR] ${data}`);
  });

  child.on('close', (code) => {
    console.log(`[${file}] exited with code ${code}`);
  });
});
