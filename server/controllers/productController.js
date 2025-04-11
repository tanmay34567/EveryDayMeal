import Product from "../models/Product.js"




export const addProduct = async (req , res)=>{
    try {
        let productData = JSON.parse(req.body.productData)
        await Product.create({...productData})

        res.json({success :true,message : "product Added"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false,message:error.message})
        
    }


}

export const productList = async (req , res)=>{
    try {
        const products = await Product.find({})
        res.json({success:true , products})
    } catch (error) {
        console.log(error.message);
        res.json({success: false,message:error.message})
    }


}

export const productById = async (req , res)=>{
    try {
        const{id}=res.body
        const products = await Product.findById(id)
        res.json({success:true , products})


    } catch (error) {
        console.log(error.message);
        res.json({success: false,message:error.message})
        
    }


}

export const changeStock = async (req , res)=>{
    try {
        const{id,inStock}=res.body
        await Product.findByIdAndUpdate(id,{inStock})
        res.json({success:true , message:"Stock updated"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false,message:error.message})
        
    }
}




