const express = require('express')
const mongoose = require('mongoose')

const { Schema } = mongoose

const app = express();
const cors = require('cors')
const PORT = 8080;
app.use(cors())
const json = require('body-parser').json
app.use(json())
const productSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    color: { type: String, enum: ['red', 'green', 'black'] },
    size: { type: String, enum: ['S', 'M', 'L'] },
    image: { type: String, required: true },
    img: { type: [String], required: true },
    details: Object,
}, { timestamps: true })

const cartSchema = new Schema({
    items: { type: [Object], required: true, default: [] },
    userId: { type: Number, default: 1 }
}, { timestamps: true })


const Product = new mongoose.model('Product', productSchema)
const Cart = new mongoose.model('Cart', cartSchema)

main().catch(err => console.log(err))

async function main() {
    await mongoose.connect('mongodb+srv://nitishcoderr:Nitish25@cluster0.icw48xp.mongodb.net/')
    console.log('DB CONNECTED');
}

app.get('/', (req, res) => {
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

app.get('/product', (req, res) => {
    Product.find({}).then(result => {
        res.send(result)
    })
});

app.post('/cart', (req, res) => {
    const userId = 1
    const item = req.body.item;
    if(!item.quantity){
        item.quantity = 1
    } 
    Cart.findOne({ userId: userId }).then(result => {
        if (result) {
            const itemIndex = result.items.findIndex(it => it._id == item._id)
            if (itemIndex >= 0) {
                result.items.splice(itemIndex, 1, item);
            } else {
                result.items.push(item)
                result.save().then(cart => {
                    res.send(cart)
                })
            }
        }else{
            let cart = new Cart()
            cart.userId = userId;
            cart.items = [item]
            cart.save()
            cart.save().then(cart => {
                res.send(cart)
            })
        }
    })
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})