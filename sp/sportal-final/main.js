const { spawn } = require('child_process');
const path = require('path');

// Relative paths to local server files
const servers = [path.join(__dirname, 'men.js'), path.join(__dirname, 'mentorship.js'),, path.join(__dirname, 'server.js'),, path.join(__dirname, 'sever1.js'),, path.join(__dirname, 'track.js'),, path.join(__dirname, 'webi.js')];

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
