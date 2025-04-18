import express from 'express';


import { isAuth, login, logout, register } from '../controllers/Vendorcontroller.js';
import authVendor from '../middlewares/authVendor.js';

const VendorRouter = express.Router();

VendorRouter.post('/register', register);
VendorRouter.post('/login', login);
VendorRouter.get('/is-auth', authVendor, isAuth);
VendorRouter.get('/logout', authVendor, logout);

export default VendorRouter;
