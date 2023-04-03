const mongoose = require('mongoose')

const friendSchema = new mongoose.Schema({
    user_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
    friend_id:{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
    },
})

module.exports = mongoose.model('Friend',friendSchema);