const express = require('express');
const nodemailer = require('nodemailer');
const mysql = require('mysql2/promise');
require('dotenv').config();
const router = express.Router();

const db = mysql.createPool({
  host: 'museum-db.c9i4mkywg672.us-east-2.rds.amazonaws.com',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: 'museum'
});

const sendExhibitionNotifications = async () => {
  try {
    console.log('Starting notification process...');
    const [exhibitions] = await db.query(`SELECT exhibit_id, name, end_date FROM Exhibition WHERE notify_customers = TRUE`);

    for (const exhibition of exhibitions) {
      const [customers] = await db.query(`SELECT email FROM Authentication WHERE customer_id IS NOT NULL`);
      console.log(`Sending notifications for exhibition: ${exhibition.name}`);

      for (const customer of customers) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        try {
          const info = await transporter.sendMail({
            from: `"Houston Museum of Fine Arts" <${process.env.EMAIL_USER}>`,
            to: customer.email,
            subject: `${exhibition.name} Ending Soon`,
            html: `
              <html>
                <body style="font-family: Arial, sans-serif; color: #333;">
                  <img src="https://cdn.britannica.com/51/194651-050-747F0C18/Interior-National-Gallery-of-Art-Washington-DC.jpg" alt="Gallery" width="600">
                  <h1 style="color: #333;">${exhibition.name} - Ending Soon!</h1>
                  <p style="font-size: 16px;">Dear Customer,</p>
                  <p>Our beloved exhibition "<b>${exhibition.name}</b>" is ending soon on ${new Date(exhibition.end_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}. Don’t miss out on this amazing experience!</p>
                  <p>Best regards,<br>The Houston Museum of Fine Arts</p>
                </body>
              </html>`
          });

          console.log(`Email sent to ${customer.email}: ${info.response}`);
        } catch (error) {
          console.error(`Failed to send email to ${customer.email}:`, error);
        }
      }
      
      // Reset notification flag to avoid re-sending
      await db.query(`UPDATE Exhibition SET notify_customers = FALSE WHERE exhibit_id = ?`, [exhibition.exhibit_id]);
      console.log(`Notifications sent for exhibition: ${exhibition.name}`);
    }
  } catch (err) {
    console.error('Error in notification process:', err);
  }
};

// Create a route to trigger the notifications manually
router.post('/sendNotifications', async (req, res) => {
  await sendExhibitionNotifications();
  res.status(200).json({ message: "Notifications sent successfully." });
});

// Call the notification function immediately for testing
//sendExhibitionNotifications();

// Schedule the function for daily execution
setInterval(sendExhibitionNotifications, 86400000); 

module.exports = router;
