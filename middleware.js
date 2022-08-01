const {articleSchema} = require('./schemas')
const {commentSchema} = require('./schemas')
const ExpressError = require('./utils/ExpressErrors');
const Article = require('./models/article');
const Comment = require('./models/comment')

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next();
}

module.exports.validateArticle = (req,res,next) => {
    const {error} = articleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(400,msg)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req,res,next) => {
    const {id} = req.params;
    const article = await Article.findById(id)
    if (!article.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/articles/${id}`)
    }
    next();
}

module.exports.validateComment = (req, res,next) => {
    const {error} = commentSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(400,msg)
    } else {
        next();
    }
}

module.exports.isCommentAuthor = async (req,res,next) => {
    const {commentId, id} = req.params;
    const comment = await Comment.findById(commentId)
    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/articles/${id}`)
    }
    next();
}