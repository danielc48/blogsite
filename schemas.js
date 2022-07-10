const Joi = require('joi');

module.exports.articleSchema = Joi.object({
    article: Joi.object({
        title: Joi.string().required(),
        author: Joi.string().required(),
        description: Joi.string().required(),
        markdown: Joi.string().required()
    }).required()
})