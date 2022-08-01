const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Article = require('../models/article');
const Comment = require('../models/comment')
const {validateComment, isLoggedIn, isCommentAuthor} = require('../middleware')



router.post('/', isLoggedIn, validateComment, catchAsync(async(req,res)=>{
    const article = await Article.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id
    article.comments.push(comment);
    await article.save();
    await comment.save();
    req.flash('success', 'Successfully added a comment!')
    res.redirect(`/articles/${article._id}`)

}))

router.delete('/:commentId', isLoggedIn, isCommentAuthor, catchAsync(async(req,res) => {
    const {id, commentId} = req.params
    await Article.findByIdAndUpdate(id, {$pull: {comments: commentId}})
    await Comment.findByIdAndDelete(commentId)
    req.flash('success', 'Successfully deleted a comment!')
    res.redirect(`/articles/${id}`)
}))

module.exports = router;