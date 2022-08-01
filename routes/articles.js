const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressErrors');
const Article = require('../models/article');
const {isLoggedIn, validateArticle, isAuthor} = require('../middleware')


router.get('/', catchAsync(async(req,res) => {
    const articles = await Article.find({}).sort({date: 'desc'});
    res.render('articles/index', {articles})
}));

router.get('/new', isLoggedIn, (req,res) => {
    res.render('articles/new')
})

router.post('/', isLoggedIn, validateArticle, catchAsync(async (req,res) => {
    if (!req.body.article) throw new ExpressError(400, 'Invalid Campground Data')
    const article = new Article(req.body.article)
    article.author = req.user._id
    await article.save();
    req.flash('success', 'Successfully created a new article!')
    res.redirect(`/articles/${article._id}`)
}));

router.get('/:id', catchAsync(async(req,res,next) => {
    const article = await Article.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author')
    console.log(article)
    if (!article) {
        req.flash('error', "Sorry, couldn't find that article.")
        return res.redirect('/articles')
    }
    res.render('articles/show', {article})
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const {id} = req.params
    const article = await Article.findById(id);
    if (!article) {
        req.flash('error', "Sorry, couldn't find that article.")
        return res.redirect('/articles')
    }
    res.render('articles/edit', {article})
}))

router.put('/:id', isLoggedIn, isAuthor, validateArticle, catchAsync(async(req,res) => {
    const { id } = req.params;
    const article = await Article.findById(id)
    article.title = req.body.article.title;
    article.description = req.body.article.description;
    article.markdown = req.body.article.markdown;
    await article.save()
    req.flash('success', 'Successfully edited an article!')
    res.redirect(`/articles/${article._id}`)
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async(req,res) => {
    const {id} = req.params;
    await Article.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted an article!')
    res.redirect('/articles')
}))

module.exports = router;