import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define location schema
const locationSchema = new mongoose.Schema({
  id: String,
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
});

const Location = mongoose.model('Location', locationSchema);

// SOS endpoint
app.post('/api/sos', async (req, res) => {
  try {
    // Fetch the latest location from the database
    const latestLocation = await Location.findOne().sort({ timestamp: -1 });

    if (!latestLocation) {
      return res.status(404).json({ success: false, message: 'No location data found' });
    }

    const { latitude, longitude } = latestLocation;
    
    // Format message with location
    const message = `SOS! I need help. This is an emergency. https://www.google.com/maps?q=${latitude},${longitude}`;

    const emergencyContacts = process.env.EMERGENCY_CONTACTS.split(',');

    // Send message to all emergency contacts
    const messagePromises = emergencyContacts.map(phoneNumber =>
      twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber.trim(),
      })
    );

    await Promise.all(messagePromises);

    res.status(200).json({ success: true, message: 'SOS messages sent successfully' });
  } catch (error) {
    console.error('Error sending SOS messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send SOS messages',
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
