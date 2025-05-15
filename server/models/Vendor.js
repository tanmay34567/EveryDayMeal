import mongoose from "mongoose";
 const VendorSchema = new mongoose.Schema({
    name: {type: String,required: true},
    email: { type: String, required: true, unique: true },
    contactNumber: { type: String, required: true, unique: true },
    password: {type: String,required: true},
    

 })

 const Vendor = mongoose.models.Vendor || mongoose.model('Vendor',VendorSchema)
 
export default Vendor;