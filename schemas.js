const Joi = require('joi');

module.exports.articleSchema = Joi.object({
    article: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        markdown: Joi.string().required()
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
        date: Joi.date().iso()
    }).required()
})