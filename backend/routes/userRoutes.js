const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { username, email, password, mobilenumber } = req.body;

  console.log(req.body);

  const user = await User.findOne({ email });

  if (user) {
    return res.json({ status: false, message: 'User already exists' });
  }

  const newUser = new User({
    username,
    email,
    password, 
    mobilenumber
  });

  await newUser.save();
  return res.json({ status: true, message: 'User registered successfully' });
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ status: false, message: 'User not found' });
  }

 
  if (password !== user.password) {
    return res.json({ status: false, message: 'Invalid password' });
  }

  const token = jwt.sign(
    { username: user.username, email: user.email, role: user.role },
    'Secret-key',
    { expiresIn: '1h' }
  );
  res.cookie('token', token, { httpOnly: true, maxAge: 3600000 });
  return res.json({ status: true, message: 'User logged in successfully', user });
});


router.get('/users', (req, res)=>{

    User.find({}).then((users)=>{
      res.json(users)
    }).catch((err)=>{
      res.json(err)
    })

})


router.get('/userdata', async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = jwt.verify(token, 'Secret-key');
    const user = await User.findOne({ email: decoded.email });
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    return res.status(200).json({userId:user._id, username: user.username ,email: user.email,
      mobilenumber: user.mobilenumber,profileimg: user.profileimg,role: user.role});
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/getuserbyid/:userid', async (req, res) => {
  const  id  = req.params;
  console.log(req.params);

  try {
    const user = await User.findById({_id:id});
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ username: user.username, email: user.email, mobilenumber: user.mobilenumber });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/logout', async (req, res) => {

try {
  
  res.clearCookie('token');
  return res.json({ status: true, message: 'User logged out successfully' });



} catch (error) {
    console.log(error)
}


})

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, "Secret-key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }
    req.username = decoded.username;
    req.email = decoded.email;
    next();
  });
};

router.get('/validate-token', verifyToken, (req, res) => {
  res.json({ valid: true, email: req.email });
});



module.exports = router;