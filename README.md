# 🍽️ EveryDayMeal

A modern web application connecting students with local mess vendors, enabling easy menu browsing, ordering, and review management.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Overview

EveryDayMeal is a full-stack web application that bridges the gap between students and mess vendors. Students can browse available vendors, view daily menus, and leave reviews, while vendors can manage their menus and track customer feedback.

## ✨ Features

### For Students
- 🔐 **Email OTP Authentication** - Secure login using email verification
- 📱 **Browse Vendors** - View all available mess vendors with ratings
- 🍕 **View Menus** - Check daily menus with meal timings (Breakfast, Lunch, Dinner)
- ⭐ **Rate & Review** - Leave ratings and comments for vendors
- 📍 **Vendor Information** - Access vendor contact details and addresses
- 👤 **Profile Management** - Update personal information

### For Vendors
- 🔐 **Email OTP Authentication** - Secure vendor login
- 📝 **Menu Management** - Create, update, and delete daily menus
- 📅 **Schedule Menus** - Set specific dates and days for menus
- ⏰ **Meal Timings** - Define start and end times for each meal
- 📊 **Review Dashboard** - View customer ratings and feedback
- 🏪 **Business Profile** - Display mess name, address, and contact information

### Admin Features
- ✅ **Vendor Application Review** - Approve or reject vendor applications
- 📋 **Application Management** - View pending, approved, and rejected applications

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email service (OTP delivery)
- **Cloudinary** - Image storage (for vendor documents)

## 📁 Project Structure

```
EveryDayMeal/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── assets/        # Images, icons, and static files
│   │   ├── components/    # Reusable React components
│   │   │   ├── Navbar.jsx
│   │   │   ├── StudentLogin.jsx
│   │   │   └── VendorLogin.jsx
│   │   ├── context/       # React Context API
│   │   │   └── Appcontext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── StudentVendorMenu.jsx
│   │   │   ├── VendorDashboard.jsx
│   │   │   ├── VendorApplication.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── services/      # API service functions
│   │   │   ├── api.js
│   │   │   ├── studentService.js
│   │   │   ├── vendorService.js
│   │   │   └── adminService.js
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Node.js application
│   ├── controllers/       # Request handlers
│   │   ├── Studentcontroller.js
│   │   ├── Vendorcontroller.js
│   │   ├── AdminController.js
│   │   └── VendorApplicationController.js
│   ├── models/           # MongoDB schemas
│   │   ├── Student.js
│   │   ├── Vendor.js
│   │   ├── Menu.js
│   │   ├── Review.js
│   │   ├── Otp.js
│   │   └── VendorApplication.js
│   ├── routes/           # API routes
│   │   ├── StudentRoute.js
│   │   ├── VendorRoute.js
│   │   ├── AdminRoute.js
│   │   └── VendorApplicationRoute.js
│   ├── middlewares/      # Custom middleware
│   │   ├── authStudent.js
│   │   ├── authVendor.js
│   │   └── authAdmin.js
│   ├── utils/            # Utility functions
│   │   └── mailer.js
│   ├── server.js         # Server entry point
│   └── package.json
│
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/yourusername/EveryDayMeal.git
cd EveryDayMeal
```

### Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

## 🔐 Environment Variables

### Backend (.env)
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/everydaymeal
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/everydaymeal

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (for OTP)
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=noreply@everydaymeal.com
SENDER_NAME=EveryDayMeal

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
ADMIN_EMAIL=admin@everydaymeal.com
ADMIN_PASSWORD=your_admin_password

# CORS
CLIENT_URL=http://localhost:5173
```

### Frontend (.env)
Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:4000
```

## 🏃 Running the Application

### Development Mode

#### Start Backend Server
```bash
cd server
npm start
```
Server will run on `http://localhost:4000`

#### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd client
npm run build
```

#### Start Production Server
```bash
cd server
NODE_ENV=production npm start
```

## 📡 API Documentation

### Student Endpoints

#### Authentication
- `POST /api/Student/otp/send` - Send OTP to email
- `POST /api/Student/otp/verify` - Verify OTP and login
- `GET /api/Student/is-auth` - Check authentication status
- `GET /api/Student/logout` - Logout student

#### Vendors & Menus
- `GET /api/Student/vendors` - Get all vendors with menus
- `GET /api/Vendor/menu/:email` - Get vendor menu by email

#### Reviews
- `GET /api/Student/reviews/:vendorEmail` - Get reviews for a vendor
- `POST /api/Student/reviews/:vendorEmail` - Create/update review
- `DELETE /api/Student/reviews/:vendorEmail` - Delete own review

#### Profile
- `PUT /api/Student/profile` - Update student profile

### Vendor Endpoints

#### Authentication
- `POST /api/Vendor/otp/send` - Send OTP to email
- `POST /api/Vendor/otp/verify` - Verify OTP and login
- `GET /api/Vendor/is-auth` - Check authentication status
- `GET /api/Vendor/logout` - Logout vendor

#### Menu Management
- `POST /api/Vendor/menu` - Create or update menu
- `GET /api/Vendor/menu` - Get own menu
- `DELETE /api/Vendor/menu` - Delete own menu

#### Reviews
- `GET /api/Vendor/reviews` - Get own reviews and ratings

#### Profile
- `GET /api/Vendor/profile` - Get vendor profile

### Vendor Application Endpoints
- `POST /api/vendor-application/apply` - Submit vendor application
- `GET /api/vendor-application/applications` - Get all applications (Admin)
- `PUT /api/vendor-application/applications/:id/approve` - Approve application (Admin)
- `PUT /api/vendor-application/applications/:id/reject` - Reject application (Admin)

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/is-auth` - Check admin authentication

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables:
   - `VITE_API_URL=https://your-backend-url.com`
4. Deploy

### Backend (Render)
1. Push code to GitHub
2. Create new Web Service on Render
3. Set environment variables (all from `.env`)
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

### Database (MongoDB Atlas)
1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGODB_URI` in backend environment variables

## 🔑 Key Features Implementation

### OTP Authentication
- Email-based OTP system using Brevo API
- 6-digit OTP with 5-minute expiration
- Automatic account creation on first login

### Menu Management
- Day and date validation
- Meal-wise menu (Breakfast, Lunch, Dinner)
- Time slot management for each meal
- Edit and delete functionality

### Review System
- 5-star rating system
- Comment support
- One review per student per vendor
- Average rating calculation
- Review count tracking

### Navigation Guards
- Prevents accidental back navigation on dashboards
- Maintains user session state
- Smooth page transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Authors

- **Tanmay Wagh** - Initial work

## 🙏 Acknowledgments

- React and Express.js communities
- MongoDB documentation
- Tailwind CSS team
- All contributors and testers

## 📞 Support

For support, email tanmayhtw@gmail.com or open an issue in the repository.

---

Made with ❤️ by Tanmay Wagh
