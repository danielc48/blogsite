const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Article = require('../models/article');
const Comment = require('../models/comment')
const {commentSchema} = require('../schemas')

const validateComment = (req, res,next) => {
    const {error} = commentSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(400,msg)
    } else {
        next();
    }
}

router.post('/', validateComment, catchAsync(async(req,res)=>{
    const article = await Article.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    article.comments.push(comment);
    await article.save();
    await comment.save();
    res.redirect(`/articles/${article._id}`)

}))

router.delete('/:commentId', catchAsync(async(req,res) => {
    const {id, commentId} = req.params
    await Article.findByIdAndUpdate(id, {$pull: {comments: commentId}})
    await Comment.findByIdAndDelete(commentId)
    res.redirect(`/articles/${id}`)
}))

module.exports = router;