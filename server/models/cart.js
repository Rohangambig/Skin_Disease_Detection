const mongoose = require('mongoose');


const cartMedicine = mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        required:true
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'medicines',
        required:true
    },
    time:{
        type:Date,
        default:Date.now
    }

});


module.exports = mongoose.model('cart',cartMedicine);