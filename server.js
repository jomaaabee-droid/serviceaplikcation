const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(require('path').join(require('os').homedir(), 'serviceapp-uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/sick', require('./routes/sick'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/reminders', require('./routes/reminders'));
app.use('/api/revenue', require('./routes/revenue'));
app.use('/api/income', require('./routes/income'));

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/serviceapp')
  .then(() => console.log('MongoDB ansluten'))
  .catch(err => console.error('MongoDB fel:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server körs på port ${PORT}`));
