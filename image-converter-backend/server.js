// server.js
const { Image } = require('image-js');
const { Sequelize } = require('sequelize');
const express = require('express');
const wrap = require('express-async-wrap')
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const sharp = require('sharp');
const bodyParser = require('body-parser');
const sequelizeConfig = require('./sequelize.config');
const UserModel = require('./models/User');
const ImageModel = require('./models/Image');
const app = express();
const PORT = process.env.PORT || 5000;
const sequelize = new Sequelize(sequelizeConfig.development);
const User = UserModel(sequelize);
const Images = ImageModel(sequelize);
const ConversionHistory = require('./models/ConversionHistory')(sequelize);
// ----------------------------------
const secretKeyPath = path.join(__dirname, 'secret_key.txt');
const secretKey = fs.readFileSync(secretKeyPath, 'utf-8').trim();
// -------------------------------------


const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
let userId = 0;

const generateAuthToken = (user) => {
  const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '30d' });
  return token;
};

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const updatedUser = req.body;
  console.log("body : ", updatedUser)
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.update(updatedUser);
    res.json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/user', async (req, res) => {
  try {
    const userId = req.body.userId; // Access userId from req.body
    const user = await User.findOne({ where: { id: userId } }); // Use userId in the query
    res.json(user);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/api/signup', async (req, res) => {
  try {
    const { firstname, name, email, password, role } = req.body;
    const newUser = await User.create({
      firstname,
      name,
      email,
      password,
      role,
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
    if (user && user.password === password && user.email == email) {
      const token = generateAuthToken(user); // Generate a new token
      userId = user.id;
      console.log(" userid : " + userId)
      console.log(" userrole : " + user.role)
      res.status(200).json({ message: 'Login successful', userId: user.id, token, userRole: user.role });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/convert', upload.single('image'), async (req, res) => {
  try {
    console.log('req.body:', req.body);
    const userId = req.body.userId;
    const conversionType = req.body.conversionType;
    const imageBuffer = req.file.buffer;
    const compressionLevel = req.body.compressionLevel || 100; // Default compression level
    const resizeWidth = req.body.resizeWidth || undefined;
    const resizeHeight = req.body.resizeHeight || undefined;
    let convertedImageBuffer = sharp(imageBuffer)
      .toFormat(conversionType);
    if (conversionType === 'jpeg') {
      convertedImageBuffer = convertedImageBuffer.jpeg({ quality: parseInt(compressionLevel) });
    }
    if (resizeWidth && resizeHeight) {
      convertedImageBuffer = convertedImageBuffer.resize({
        width: parseInt(resizeWidth),
        height: parseInt(resizeHeight),
        fit: 'contain',
      });
    }
    convertedImageBuffer = await convertedImageBuffer.toBuffer();
    const imageName = `converted_${Date.now()}.${conversionType}`;
    const imagePath = path.join(__dirname, 'converted-images', imageName);
    fs.writeFile(imagePath, convertedImageBuffer, async (err) => {
      if (err) {
        console.error('Error writing file:', err);
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        try {
            const stats = fs.statSync(imagePath);
            const fileSizeInBytes = stats.size;
            const imageSize = fileSizeInBytes / (1024 * 1024); // Convert bytes to megabytes
            console.log("imageSize : ", imageSize)
            const imageUrl = `/converted-images/${imageName}`;
            const conversionRecord = await ConversionHistory.create({
              imageUrl,
              conversionType,
              userId,
              imageSize,
          });
          res.json({ 
                      message: 'Image converted and history recorded successfully', 
                      conversionRecord,
                      imageSize // Include the size of the converted image in the response
                    });
        } catch (error) {
          console.error('Error saving conversion record:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      }
    });
  } catch (error) {
    console.error('Error during image conversion and history recording:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/images', async (req, res) => {
  try {
    const images = await ConversionHistory.findAll();
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { imageUrl, conversionType, imageSize, createdAt } = req.body;
    const image = await ConversionHistory.findByPk(id);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    image.imageUrl = imageUrl;
    image.conversionType = conversionType;
    image.imageSize = imageSize;
    image.createdAt = createdAt;
    await image.save();
    return res.status(200).json({ message: 'Image updated successfully', image });
  } catch (error) {
    console.error('Error updating image:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/api/images/:id', async (req, res) => {
  const { id } = req.params;
  console.log(" id image : ", id)
  try {
    const image = await ConversionHistory.findByPk(id);
    console.log(" image find ", image)
    if (!image) {
      return res.status(404).json({ error: 'image not found' });
    }
    await image.destroy();
    res.json({ message: 'image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/latest-images', async (req, res) => {
  try {
    const latestImages = await ConversionHistory.findAll({
      where: { userId: userId },
      order: [['createdAt', 'DESC']],
      limit: 10,
    });
    res.json(latestImages);
    console.log('latestImages:', latestImages);
  } catch (error) {
    console.error('Error fetching latest images:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/delete-image', async (req, res) => {
  const { id } = req.body;
  try {
    const imageToDelete = await ConversionHistory.findByPk(id);
    if (!imageToDelete) {
      return res.status(404).json({ error: 'Image not found' });
    }
    await imageToDelete.destroy();
    const imagePath = path.join(__dirname, req.body.imageName );
    fs.unlinkSync(imagePath);
    res.json({ message: 'Image deleted successfully' });
    const message = { event: 'imageDeleted', imageId: id };
    broadcast(message);
  
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.use('/converted-images', express.static(path.join(__dirname, 'converted-images')));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
