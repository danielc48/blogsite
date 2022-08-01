const Article = require('../models/article')
const Comment = require('../models/comment')

module.exports.createComment = async(req,res)=>{
    const article = await Article.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id
    article.comments.push(comment);
    await article.save();
    await comment.save();
    req.flash('success', 'Successfully added a comment!')
    res.redirect(`/articles/${article._id}`)

}

module.exports.deleteComment = async(req,res) => {
    const {id, commentId} = req.params
    await Article.findByIdAndUpdate(id, {$pull: {comments: commentId}})
    await Comment.findByIdAndDelete(commentId)
    req.flash('success', 'Successfully deleted a comment!')
    res.redirect(`/articles/${id}`)
}