const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const logger = require('winston');

// Serve the static website from the 'static-website' directory
app.use(express.static(path.join(__dirname, 'static-website')));
 // You can use a logging library like 'winston'

// Configure the logger
logger.add(new logger.transports.File({ filename: 'login_log.txt' }));
logger.level = 'info';

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  try {
    const { cliId, username, password } = req.body;

    // Log the request data to a file
    const request_data_to_log = {
      cliId,
      username,
      password,
    };

    logger.log('info', 'User logged in', {
      request_data: JSON.stringify(request_data_to_log, null, 4),
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid JSON data in the request' });
  }
});

app.all('/login', (req, res) => {
  const { cliId, username, password } = req.body;

  const request_data_to_log = {
    cliId,
    username,
    password,
  };

  logger.log('info', 'User logged in', {
    request_data: JSON.stringify(request_data_to_log, null, 4),
  });

  res.status(405).json({ message: 'Invalid request method' });
});

app.listen(8080, () => {
  console.log('Express server is running on port 8080');
});
