const express = require('express')
const mongoose = require('mongoose')

const {Schema} = mongoose

const app = express();
const PORT = 8080;

const productSchema= new Schema({
    name:{type:String,required:true},
    category:{type:String,required:true},
    price:{type:Number,required:true},
    rating:{type:Number,required:true},
    color: { type: String, enum: ['red', 'green', 'black']},
    size: { type: String, enum: ['S', 'M', 'L']},
    image:{type:String,required:true},
    img:{type:[String],required:true},
    details:Object,
},{timestamps:true})


const Product = new mongoose.model('Product',productSchema)

main().catch(err=>console.log(err))

async function main(){
    await mongoose.connect('mongodb+srv://nitishcoderr:Nitish25@cluster0.icw48xp.mongodb.net/')
    console.log('DB CONNECTED');
}

app.get('/',(req,res)=>{
    res.send('Shopkro')
})

// app.get('/createproduct',(req,res)=>{
//     let product = new Product({
//             name: 'Apple iPhone 11',
//             price: 700.75,
//             category: 'Mobile',
//             rating: 4,
//             color: 'black',
//             size: 'M',
//             details: {
//                 product: 'Product-2',
//                 warrenty: 'Warrenty',
//                 merchant: 'Shayam'
//             },
//             image: 'product-3-square',
//             img: ['product-3', 'product-3-2', 'product-3-3']
//     })
//     product.save().then((success)=>{
//         res.send(success)
//     }).catch(err=>{
//         res.error(err)
//     })
// })

app.get('/product',(req,res)=>{
    Product.find({}).then(result=>{
        res.send(result)
    })
});

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})