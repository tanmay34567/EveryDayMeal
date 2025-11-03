import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import StudentRouter from './routes/StudentRoute.js';
import VendorRouter from './routes/VendorRoute.js';
import router from './routes/contactRoutes.js';
import scheduleMenuDeletion from './cron/deleteMenus.js';
import VendorApplicationRouter from './routes/VendorApplicationRoute.js';
import AdminRouter from './routes/AdminRoute.js';

// At the beginning of the file
console.log("Server is starting...");
 
const app = express();
const port = process.env.PORT || 4000;

await connectDB()

//Allow Multiple version 
const allowedOrigins = ['http://localhost:5173','https://every-day-meal.vercel.app']


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); 

// Log all incoming requests for debugging (before routes)
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path} | Origin: ${req.headers.origin || 'unknown'}`);
  next();
});

// Basic route
app.get('/', (req, res) => {
  res.send("API is working");
});

app.use('/api/Student', StudentRouter)
app.use('/api/Vendor', VendorRouter)
app.use('/api', router);
app.use('/api/vendor', VendorApplicationRouter);
app.use('/api/admin', AdminRouter);

// 404 handler for undefined routes
app.use((req, res) => {
  console.log(`❌ Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false, 
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: {
      vendor: [
        'GET /api/Vendor/menu',
        'POST /api/Vendor/menu',
        'GET /api/Vendor/reviews',
        'GET /api/Vendor/is-auth',
        'POST /api/Vendor/otp/send',
        'POST /api/Vendor/otp/verify'
      ]
    }
  });
});

scheduleMenuDeletion();

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

