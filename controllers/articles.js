const Article = require('../models/article')

module.exports.index = async(req,res) => {
    const articles = await Article.find({}).sort({date: 'desc'});
    res.render('articles/index', {articles})
}

module.exports.renderNewForm = (req,res) => {
    res.render('articles/new')
}

module.exports.createArticle = async (req,res) => {
    if (!req.body.article) throw new ExpressError(400, 'Invalid Campground Data')
    const article = new Article(req.body.article)
    article.author = req.user._id
    await article.save();
    req.flash('success', 'Successfully created a new article!')
    res.redirect(`/articles/${article._id}`)
}

module.exports.showArticle = async(req,res,next) => {
    const article = await Article.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (!article) {
        req.flash('error', "Sorry, couldn't find that article.")
        return res.redirect('/articles')
    }
    res.render('articles/show', {article})
}

module.exports.renderEditForm = async(req,res) => {
    const {id} = req.params
    const article = await Article.findById(id);
    if (!article) {
        req.flash('error', "Sorry, couldn't find that article.")
        return res.redirect('/articles')
    }
    res.render('articles/edit', {article})
}

module.exports.updateArticle = async(req,res) => {
    const { id } = req.params;
    const article = await Article.findById(id)
    article.title = req.body.article.title;
    article.description = req.body.article.description;
    article.markdown = req.body.article.markdown;
    await article.save()
    req.flash('success', 'Successfully edited an article!')
    res.redirect(`/articles/${article._id}`)
}

module.exports.deleteArticle = async(req,res) => {
    const {id} = req.params;
    await Article.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted an article!')
    res.redirect('/articles')
}