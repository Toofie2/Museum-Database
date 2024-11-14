const express = require("express");
const nodemailer = require("nodemailer");
const mysql = require("mysql");
require("dotenv").config();
const router = express.Router();

const db = mysql.createPool({
  host: "museum-db.c9i4mkywg672.us-east-2.rds.amazonaws.com",
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "museum",
});

const sendMembershipNotifications = async () => {
  try {
    console.log("Starting membership notification process...");

    // Select customers whose memberships are about to expire and have not yet been notified
    const [customers] = await db.query(
      `SELECT Customer.customer_id, Customer.first_name, Authentication.email 
       FROM Customer 
       INNER JOIN Authentication ON Customer.customer_id = Authentication.customer_id
       WHERE Customer.notify_customers = TRUE AND Customer.is_member = TRUE`
    );

    for (const customer of customers) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      try {
        const info = await transporter.sendMail({
          from: `"The Fine Arts Museum" <${process.env.EMAIL_USER}>`,
          to: customer.email,
          subject: "Membership Expiring Soon",
          html: `
            <html>
              <body style="font-family: Arial, sans-serif; color: #333;">
                <img src="https://www.geelonggallery.org.au/cms_uploads/images_1200/13_install_collection-hang-hitchcock_august-2017_lowres-3-website.jpg" alt="Gallery" width="600">
                <h1 style="color: #333;">It's time to renew your membership, ${customer.first_name}!</h1>
                <p style="font-size: 16px;">Dear ${customer.first_name},</p>
                <p>Your membership will expire soon. Don’t miss out on all of our exclusive benefits!</p>
                <p>Best regards,<br>The Fine Arts Museum</p>
              </body>
            </html>`,
        });

        console.log(`Email sent to ${customer.email}: ${info.response}`);

        // Reset notify_customers in Customer after email is sent
        await db.query(
          `UPDATE Customer SET notify_customers = FALSE WHERE customer_id = ?`,
          [customer.customer_id]
        );
      } catch (error) {
        console.error(`Failed to send email to ${customer.email}:`, error);
      }
    }

    console.log("All membership notifications sent successfully.");
  } catch (err) {
    console.error("Error in membership notification process:", err);
  }
};

// Call the notification function immediately for testing
//sendMembershipNotifications();

// Schedule the function for daily execution
setInterval(sendMembershipNotifications, 30000);

module.exports = router;
