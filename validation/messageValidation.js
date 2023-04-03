const Joi = require('joi');

const messageValidation = data => {
    const schema = Joi.object({
        receiver_id: Joi.string().min(24).max(24).required(),
        content: Joi.string().min(1).required(),
        timestamp:  Joi.date().timestamp().required()
    });
    return schema.validate(data)
}

module.exports.messageValidation = messageValidation;