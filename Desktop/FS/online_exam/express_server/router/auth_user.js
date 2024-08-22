const express = require('express')
const jwt = require('jsonwebtoken');
// const svgCaptcha = require('svg-captcha');
const con = require('./db.js');
const secretOrPrivateKey = "xavier";
// const crypto = require('crypto');

const router = express.Router();

  function validateAccessToken(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    // console.log("auth header", authorizationHeader);
  
    if (!authorizationHeader) {
      return res.status(401).json({ api_status: false, message: 'Access token is missing' });
    }
  
    const tokenParts = authorizationHeader.split(' ');

    // console.log("tokenpart", tokenParts);
  
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ api_status: false, message: 'Invalid access token format' });
    }
  
    const accessToken = tokenParts[1];

    // console.log("access token", accessToken);
  
    jwt.verify(accessToken, secretOrPrivateKey, (err, decoded) => {
      if (err) {
        console.error('Error validating access token:', err);
        return res.status(401).json({ api_status: false, message: 'Invalid access token' });
      }
  
      // Attach the decoded user information to the request for later use
      req.user = decoded.user;
  
      // Continue with the next middleware or route handler
      next();
    });
  }


  router.post("/refresh-token", (req, res) => {
    const refreshToken = req.body.refreshToken;

    // console.log('refresh token', refreshToken)
  
    if (!refreshToken) {
        console.log("if refresh token");
      return res.status(401).json({ api_status: false, message: 'Refresh token is missing' });
    }
  
    jwt.verify(refreshToken, secretOrPrivateKey, (err, decoded) => {
      if (err) {
        console.error('Error verifying refresh token:', err);
        return res.status(403).json({ api_status: false, message: 'Invalid refresh token' });
      }

      if (decoded.exp <= Date.now() / 1000) {
        console.error('Refresh token has expired');
        return res.status(403).json({ api_status: false, message: 'Refresh token has expired' });
    }
  
      const username = decoded.user;
  
      // You can perform additional checks here if needed
  
      const newAccessToken = jwt.sign({ user: username }, secretOrPrivateKey, { expiresIn: '10m' });
  
      console.log("New Access token:", newAccessToken);
  
      res.json({ api_status: true, message: 'New access token generated', access: newAccessToken, refresh: refreshToken });
    });
  });

const authenticatedUser = (username,password, callback)=>{

    var sql = "SELECT * FROM emisuser_student WHERE emis_username = ?;";

    console.log("sql", sql);
    
    con.query(sql, [username], (err, result) => {
      if (err) {
        console.log("Database connection error", err);
        callback(err, false);
      } else {
        console.log("Result from the database:", result);
    
        let validusers = result.filter((user) => {
          console.log("Checking user:", user);
          console.log("Comparing:", user.emis_username, username, user.ref, password);
          return user.emis_username == username && user.ref == password;
        });
    
        console.log("Valid users:", validusers);
    
        if (validusers.length > 0) {
            const authenticatedUser = validusers[0];
            callback(null, true, authenticatedUser);
          } else {
            callback(null, false);
          }
      }
    });


  }

  router.post("/login",(req, res) => {

    const username = req.body.username;
    const password = req.body.password;
  
    authenticatedUser(username, password,  (err, isAuthenticated, user) => {
  
      if(err)
      {
        console.log("error in Authentication",err);
        return res.status(500).json({message:'internal server error'});
      }
  
      if( !isAuthenticated){
        console.log("invaild Credentials");
        // return res.status(500).json({message:"Invaild Credentials"});
        res.json({api_status: false, message: 'Invaild Credentials'});
      }
      else{
        console.log("Authenticated Successfully");
  
        if (!secretOrPrivateKey) {
          console.error('JWT secret key is missing or empty');
        }
        
        const token = jwt.sign({ user: username }, secretOrPrivateKey, { expiresIn: '1m' });
  
        const refreshToken = jwt.sign({ user: username }, secretOrPrivateKey, { expiresIn: '1h' });
        
        console.log("Access token:", token);
  
        console.log('Refresh token', refreshToken);
  
        res.json({ 
            api_status: true, 
            message: 'Login successful', 
            username: username, 
            access: token, 
            refresh: refreshToken,
            Name: user.student_name,
            udise_code: user.udise_code,
            school_name: user.school_name,
            standard: user.class_studying_id,
            user_type: user.emis_usertype,
            class_section: user.class_section,
        });
      }
  
    });
  
  } );

  

//   module.exports = router;
module.exports = { router, validateAccessToken };