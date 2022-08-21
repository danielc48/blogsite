const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const marked = require('marked');
const createDOMPurify = require('dompurify');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dompurify = createDOMPurify(new JSDOM().window)

const Comment = require('./comment')
 
const articleSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
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
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

articleSchema.pre('validate', function(next) {
    if(this.markdown) {
         this.sanitizedHTML =  dompurify.sanitize(marked.parse(this.markdown)) 
    }
    next();
})

articleSchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Article', articleSchema)

