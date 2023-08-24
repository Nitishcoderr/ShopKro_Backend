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
    image:{type:String,required:true},
    img:{type:[String],required:true},
    // color:'red'|'green'|'black',
    // size:'S' | 'M' | 'L',
    details:Object,
},{timestamps:true})


main().catch(err=>console.log(err))

async function main(){
    await mongoose.connect('mongodb+srv://nitishcoderr:Nitish25@cluster0.icw48xp.mongodb.net/')
    console.log('DB CONNECTED');
}

app.get('/',(req,res)=>{
    res.send('HELLO')
})

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})