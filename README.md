<div align="center">
  <img src="client/src/assets/GitHub Banner.png" alt="The Fine Arts Museum Banner" width="100%">
</div>

# The Fine Arts Museum

Full-stack application and database system for COSC 3380: Database Systems

## Mini-World Description

The Fine Arts Museum seeks to revolutionize its operations and visitor experience through a comprehensive web application and database system. This platform bridges the museum's vast cultural offerings and its diverse audience while empowering staff with powerful management tools. Our Mini-world is divided into four sections:

### Customer Experience 🎨

Visitors to the MFA's digital platform can:

- Explore the museum's extensive selection of exhibitions and collections
- Access detailed information about current and upcoming exhibits
- Browse and purchase items from the museum's curated gift shop
- Leave reviews and feedback about their exhibit and general visit experiences
- Purchase tickets for general admission or special exhibitions
- Purchase a yearly membership for free tickets and other benefits

### Museum Staff Portal 💼

#### Staff Capabilities

- Manage exhibition and collection information
- Update artwork and artist details
- Handle product and ticket inventory
- Track and fulfill assigned tasks
- Edit own staff profile and settings

#### Admin Capabilities

- Access all staff-level functions
- Register, edit, and manage employee profiles and performance records
- Generate analytics and reports for revenue, exhibitions, and staff productivity
- Create, assign, and monitor staff tasks and completion status
- Review customer feedback, manage profiles, and implement operational improvements

## Technologies

### Frontend

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### Backend

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![Nodemailer](https://img.shields.io/badge/Nodemailer-0F9DCE?style=for-the-badge&logo=gmail&logoColor=white)

### Database

![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)

### Testing

![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

### Deployment

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white)

### Version Control & Collaboration

![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)

## Hosting Locally

### Prerequisites

- Git installed on your machine
- Latest version of Node.js
- MySQL installed locally
- AWS account (for image storage)

### Clone the Repository

```bash
git clone https://github.com/isaiasegonzalez/Museum-Database-Project.git
cd Museum-Database-Project
code .
```

> [!IMPORTANT]
> Ensure both `client/client.env` and `server/server.env` are renamed to `.env` and are properly configured with the necessary environment variables before hosting locally.

### Starting The Client

```bash
cd client             # Navigate to the client directory.
npm i -y              # Install dependencies.
npm run dev           # Start the client.
```

> [!NOTE]
> A new window will automatically open in your default browser at http://localhost:5173 (or the port Vite chooses).

### Starting The Server

```bash
cd server      	      # Navigate to the server directory.
npm i                 # Install dependencies.
npm start             # Start the server.
```

### Database Configuration

This project uses AWS for database hosting. Ensure your .env file contains the appropriate AWS credentials and database URL to connect successfully. Misconfiguration may lead to errors or additional charges.
