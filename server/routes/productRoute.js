import express from 'express';
import { changeStock, productById, productList } from '../controllers/productController.js';
import authUser from '../middlewares/authUser.js';

const productRouter = express.Router();

productRouter.get('/list',productList)
productRouter.get('/id',productById)
productRouter.post('/stock',authUser,changeStock)

export default productRouter;