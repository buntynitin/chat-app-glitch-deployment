const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    receiver_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    content:{
        type : String,
        required : true,
        min : 1,
    },
    timestamp :{
        type : Date, 
        required : true,
        default: Date.now
    }
})

module.exports = mongoose.model('Message',messageSchema);