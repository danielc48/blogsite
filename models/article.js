const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const createDOMPurify = require('dompurify');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dompurify = createDOMPurify(new JSDOM().window)
 
const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    markdown: {
        type: String,
        required: true
    },
    sanitizedHTML: {
        type: String,
        required:true
    }
})

articleSchema.pre('validate', function(next) {
    if(this.markdown) {
        this.sanitizedHTML = dompurify.sanitize(marked.parse(this.markdown)) 
    }
    next();
})

module.exports = mongoose.model('Article', articleSchema)

