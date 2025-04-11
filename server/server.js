import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';
import connectDB from './configs/db.js';
import 'dotenv/config';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';


const app = express();
const port = process.env.PORT || 4000;

await connectDB()

//Allow Multiple version 
const allowedOrigins = ['http://localhost:5173']


// Middleware
app.use(express.json()); 
app.use(cookieParser()); 
app.use(cors({origin : allowedOrigins, credentials: true})); 



// Basic route
app.get('/', (req, res) => {
  res.send("API is working");
});

app.use('/api/user', userRouter)
app.use('/api/product',productRouter)

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

