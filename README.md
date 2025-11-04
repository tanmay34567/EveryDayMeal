# 🍽️ EveryDayMeal

> A modern web platform connecting students with local mess vendors for seamless menu browsing and ordering.

[![React](https://img.shields.io/badge/React-18.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🌟 Overview

EveryDayMeal is a full-stack web application designed to bridge the gap between students and mess vendors. Students can easily browse available vendors, view daily menus with timings, and leave reviews. Vendors can manage their menus, track feedback, and grow their business.

**Live Demo:** [Coming Soon]

## ✨ Key Features

### 👨‍🎓 For Students
- **Secure Authentication** - Email-based OTP login system
- **Browse Vendors** - View all available mess vendors with ratings and reviews
- **Daily Menus** - Check breakfast, lunch, and dinner menus with timings
- **Rate & Review** - Share feedback and help other students make informed choices
- **Vendor Details** - Access contact information and addresses

### 🏪 For Vendors
- **Menu Management** - Create, update, and schedule daily menus
- **Meal Timings** - Set specific start and end times for each meal
- **Customer Feedback** - View ratings and reviews from students
- **Business Profile** - Showcase mess name, location, and contact details
- **Dashboard Analytics** - Track customer engagement and ratings

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Vite
- React Router DOM
- Axios
- Tailwind CSS

**Backend:**
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer (OTP delivery)
- Cloudinary (Image storage)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/EveryDayMeal.git
cd EveryDayMeal
```

2. **Install backend dependencies**
```bash
cd server
npm install
```

3. **Install frontend dependencies**
```bash
cd ../client
npm install
```

4. **Set up environment variables**

Create `.env` in the `server` directory:
```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
BREVO_API_KEY=your_brevo_api_key
SENDER_EMAIL=noreply@everydaymeal.com
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

Create `.env` in the `client` directory:
```env
VITE_API_URL=http://localhost:4000
```

5. **Run the application**

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to see the app in action! 🎉

## 📁 Project Structure

```
EveryDayMeal/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── context/       # React Context
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── middlewares/      # Custom middleware
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Student Routes
- `POST /api/Student/otp/send` - Send OTP
- `POST /api/Student/otp/verify` - Verify OTP & Login
- `GET /api/Student/vendors` - Get all vendors
- `GET /api/Vendor/menu/:email` - Get vendor menu
- `POST /api/Student/reviews/:vendorEmail` - Add/Update review

### Vendor Routes
- `POST /api/Vendor/otp/send` - Send OTP
- `POST /api/Vendor/otp/verify` - Verify OTP & Login
- `POST /api/Vendor/menu` - Create/Update menu
- `GET /api/Vendor/menu` - Get own menu
- `DELETE /api/Vendor/menu` - Delete menu
- `GET /api/Vendor/reviews` - Get reviews

## 🎨 Screenshots

### Student Dashboard
![Student Dashboard](screenshots/student-dashboard.png)

### Vendor Menu Management
![Vendor Dashboard](screenshots/vendor-dashboard.png)

### Menu View
![Menu View](screenshots/menu-view.png)

## 🌐 Deployment

### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy to Vercel
```

### Backend (Render/Railway)
```bash
cd server
# Deploy to Render or Railway
```

### Database (MongoDB Atlas)
- Create a cluster on MongoDB Atlas
- Get connection string and update `MONGODB_URI`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tanmay Wagh**
- GitHub: [@tanmay34567](https://github.com/tanmay34567)
- Email: tanmayhtw@gmail.com

## 🙏 Acknowledgments

- Thanks to all contributors who helped with this project
- Inspired by the need to simplify student-vendor interactions
- Built with ❤️ for the student community

## 📞 Support

If you have any questions or need help, please open an issue or contact me at tanmayhtw@gmail.com

---

⭐ Star this repo if you find it helpful!

**Made with ❤️ by Tanmay Wagh**
