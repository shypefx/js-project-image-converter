// server.js
const { Image } = require('image-js');
const { Sequelize } = require('sequelize');
// require
const express = require('express');
const cors = require('cors'); // Import the cors middleware
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
//
const bodyParser = require('body-parser');
const sequelizeConfig = require('./sequelize.config');
const UserModel = require('./models/User');
const ConversionHistory = require('./models/ConversionHistory');

// ----------------------------------
const secretKeyPath = path.join(__dirname, 'secret_key.txt');
const secretKey = fs.readFileSync(secretKeyPath, 'utf-8').trim();
// -------------------------------------
const app = express();
const PORT = process.env.PORT || 5000;
const sequelize = new Sequelize(sequelizeConfig.development);
const User = UserModel(sequelize);

app.use(bodyParser.json()); 
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });


  const authenticateUser = (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('authHeader:', authHeader);
    const token = authHeader.split(' ')[1]; // Extract the token after 'Bearer '
    console.log('token:', token);
  
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error('Error verifying token:', err);
        return res.status(401).json({ error: 'Unauthorized' });
      }
      req.user = decoded;
      next();
    });
  };
  
  module.exports = authenticateUser;  


  const generateAuthToken = (user) => {
    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '30d' });
    return token;
  };
  

  
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && user.password === password) {
      const token = generateAuthToken(user); // Generate a new token
      console.log('Generated Token:', token);
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.post('/api/convert', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const userId = req.user.id;
    const conversionType = req.body.conversionType;
    const imageBuffer = req.file.buffer;

    // Load image using image-js
    const image = await Image.load(imageBuffer);

    // Perform image conversion
    const convertedImage = await image.toFormat(conversionType);

    // Save the converted image to the server's file system
    const imageName = `converted_${Date.now()}.${conversionType}`;
    const imagePath = path.join(__dirname, 'public', 'converted-images', imageName);
    await fs.writeFile(imagePath, convertedImage.toBuffer());

    // Save conversion record to the database
    const imageUrl = `/converted-images/${imageName}`;
    const conversionRecord = await ConversionHistory.create({
      imageUrl,
      conversionType,
      userId,
    });

    res.json({ message: 'Image converted and history recorded successfully', conversionRecord });
  } catch (error) {
    console.error('Error during image conversion and history recording:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
