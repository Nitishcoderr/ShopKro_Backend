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


// Cart schema
const cartSchema = new Schema({
    items: { type: [Object], required: true, default: [] },
    userId: { type: String, default: 1 }
}, { timestamps: true })

// Address schema
const userSchema = new Schema({
    name: String,
    email: String,
    addresses: [Object],
    orders: [Object]
}, { timestamps: true })


const Product = new mongoose.model('Product', productSchema)
const Cart = new mongoose.model('Cart', cartSchema)
const User = new mongoose.model('User', userSchema)

main().catch(err => console.log(err))

async function main() {
    await mongoose.connect('mongodb+srv://nitishcoderr:Nitish25@cluster0.icw48xp.mongodb.net/')
    console.log('DB CONNECTED');
}

app.get('/', (req, res) => {
    res.send('Shopkro')
})

// TO create User
// app.get('/createUser',(req,res)=>{
//     let user = new User({
//             name: 'Nitish',
//             email: 'nitish@gmail.com',
//             orders: [],
//             addresses:[]
//     })
//     user.save().then(usr=>{
//         res.send(usr)
//     })
// })


app.get('/user',(req,res)=>{
    User.findOne({}).then(result => {
        res.send(result)
    })
})

// TO create product
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
    const userId = '64e75944bc5ed2310c9882af' //this will solve
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
                
            }
            result.save().then(cart => {
                res.send(cart)
            })
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
app.get('/cart', (req, res) => {
    const userId = '64e75944bc5ed2310c9882af'
    Cart.findOne({ userId: userId }).then(result => {
        if (result) {
            res.send(result)
        }else{
            res.send({userId:1,items:[]})
        }
    })
});
// Delete cart
app.post('/removeItem', (req, res) => {
    const userId = '64e75944bc5ed2310c9882af';
    const item = req.body.item;
    Cart.findOne({ userId: userId }).then(result => {
        const itemIndex = result.items.findIndex(it => it._id == item._id)
            result.items.splice(itemIndex, 1);
            result.save().then(cart => {
                res.send(cart)
            })

    })
    
});
// empty cart
app.post('/emptyCart', (req, res) => {
    const userId ='64e75944bc5ed2310c9882af';
    Cart.findOne({ userId: userId }).then(result => {
            result.items=[]
            result.save().then(cart => {
                res.send(cart)
            })

    })
});

app.post('/updateUserAddress',(req,res)=>{
    const userId = '64e75944bc5ed2310c9882af'
    const address = req.body.address
    User.findOneAndUpdate({userId:userId},{address}).then((user)=>{
        user.addresses.push(address);
        user.save().then(user=>{
            res.send(address)
        })
    })
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
})