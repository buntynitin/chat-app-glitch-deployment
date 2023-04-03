const Joi = require('joi');

const friendValidation = data => {
    const schema = Joi.object({
        friend_id: Joi.string().min(24).max(24).required(),
    });
    return schema.validate(data)
}

module.exports.friendValidation =  friendValidation;