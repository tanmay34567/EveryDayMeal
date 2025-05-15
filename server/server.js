import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import StudentRouter from './routes/StudentRoute.js';
import VendorRouter from './routes/VendorRoute.js';
import router from './routes/contactRoutes.js';
import scheduleMenuDeletion from './cron/deleteMenus.js';

// At the beginning of the file
console.log("Server is starting...");
 
const app = express();
const port = process.env.PORT || 4000;

await connectDB()

//Allow Multiple version 
const allowedOrigins = ['http://localhost:5173','']


// Middleware
app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({origin : allowedOrigins, credentials: true})); 



// Basic route
app.get('/', (req, res) => {
  res.send("API is working");
});

app.use('/api/Student', StudentRouter)
app.use('/api/Vendor', VendorRouter)
app.use('/api', router);

scheduleMenuDeletion();

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

