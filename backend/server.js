const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const canvasRoutes = require('./routes/canvasRoutes');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || 'mongodb://0.0.0.0:27017/mydb';

mongoose.set('strictQuery', false);
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const cors = require('cors');
app.use(cors())
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api/users', userRoutes);

app.use('/api/canvas', canvasRoutes);

app.listen(port, () => console.log(`Server listening on port ${port}`));
