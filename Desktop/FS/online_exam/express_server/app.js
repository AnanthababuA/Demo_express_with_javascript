const express = require('express');
const session = require('express-session');
const http = require('http')
const cors = require('cors');
const path = require('path')

const app = express();
const port = 5000;
const host = "0.0.0.0"


app.use(cors());
app.use(express.json());

// app.use(express.static(__dirname + '/dist/online_exam'));

// app.get('/*', (req, res) => res.sendFile(path.join(__dirname)));

// const indexPath = path.join(__dirname, '../dist/online_exam/server/index.server.html');
// console.log('Index HTML Path:', indexPath);

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, 'dist', 'online_exam'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  },
}));

// Handle the default route by serving the 'index.server.html' file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'online_exam', 'server', 'index.server.html'));
});

const user_auth = require('./router/auth_user');
const authRouter = user_auth.router;
const validateAccessToken = user_auth.validateAccessToken;

// // Use express-session middleware
// app.use(session({
//     secret: 'alex', // Change this to a secret, random value
//     resave: false,
//     saveUninitialized: true,
//   }));

//   app.get('/reset', (req, res) => {
//     // Reset the session data
//     req.session.views = 0;
//     res.send('Session data has been reset.');
//   });


app.use("/auth",authRouter);

const event = require('./router/event_details');

app.use('/events',event)

// app.get('/', validateAccessToken, (req, res) => {
//     //   res.send('Hello, World!');
    
//     console.log("get method is running")
    
//     if (req.session.views) {
        
//         req.session.views++;
//       } else {
//         req.session.views = 1;
//       }
    
//     //   res.send(`You have visited this page ${req.session.views} times.`);
//     res.json({ api_status: true, message: 'Login successful', data: req.session.views });
//     });

app.listen(port, host,() => {
  console.log(`Server is running at http://${host}:${port}`);
});