const nodemailer = require('nodemailer');
require('dotenv').config(); 
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database.');
});

const sendMembershipNotifications = () => {
  console.log('Starting membership notification process...');
  
  db.query(
    `SELECT Customer.customer_id, Customer.first_name, Authentication.email 
     FROM Customer 
     INNER JOIN Authentication ON Customer.customer_id = Authentication.customer_id
     WHERE Customer.notify_customers = TRUE AND Customer.is_member = TRUE`,
    (err, customers) => {
      if (err) {
        console.error('Error fetching customers:', err);
        return;
      }

      customers.forEach(async (customer) => {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });

        try {
          // Send the email
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
              </html>`
          });

          console.log(`Email sent to ${customer.email}: ${info.response}`);

          // Reset notify_customers and update last_notified in Customer after email is sent
          db.query(
            `UPDATE Customer SET notify_customers = FALSE, last_notified = NOW() WHERE customer_id = ?`,
            [customer.customer_id],
            (err) => {
              if (err) {
                console.error('Error updating customer notification status:', err);
              }
            }
          );
          
        } catch (error) {
          console.error(`Failed to send email to ${customer.email}:`, error);
        }
      });

      console.log("All membership notifications sent successfully.");
    }
  );
};

//sendMembershipNotifications();

setInterval(sendMembershipNotifications, 30000);

module.exports = sendMembershipNotifications;
