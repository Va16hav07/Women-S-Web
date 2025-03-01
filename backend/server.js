import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import twilio from 'twilio';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Twilio client
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// SOS endpoint
app.post('/api/sos', async (req, res) => {
  try {
    const emergencyContacts = process.env.EMERGENCY_CONTACTS.split(',');
    const message = process.env.EMERGENCY_MESSAGE;
    
    // Send message to all emergency contacts
    const messagePromises = emergencyContacts.map(phoneNumber => 
      twilioClient.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phoneNumber.trim()
      })
    );
    
    await Promise.all(messagePromises);
    
    res.status(200).json({ success: true, message: 'SOS messages sent successfully' });
  } catch (error) {
    console.error('Error sending SOS messages:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send SOS messages',
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});