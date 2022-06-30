const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogPostSchema = new Schema({
    title: String,
    date: Date,
    descriprtion: String,
    markdown: String
})

module.exports = mongoose.model('Blogpost', blogPostSchema)

