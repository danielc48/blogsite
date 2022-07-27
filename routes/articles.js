const express = require('express');
const router = express.Router();
const {articleSchema} = require('../schemas')
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressErrors');
const Article = require('../models/article');
const {isLoggedIn} = require('../middleware')

const validateArticle = (req,res,next) => {
    const {error} = articleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(400,msg)
    } else {
        next();
    }
}

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
    await article.save();
    req.flash('success', 'Successfully created a new article!')
    res.redirect(`/articles/${article._id}`)
}));

router.get('/:id', catchAsync(async(req,res,next) => {
    const article = await Article.findById(req.params.id).populate('comments')
    if (!article) {
        req.flash('error', "Sorry, couldn't find that article.")
        return res.redirect('/articles')
    }
    res.render('articles/show', {article})
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async(req,res) => {
    const article = await Article.findById(req.params.id);
    if (!article) {
        req.flash('error', "Sorry, couldn't find that article.")
        return res.redirect('/articles')
    }
    res.render('articles/edit', {article})
}))

router.put('/:id', isLoggedIn, validateArticle, catchAsync(async(req,res) => {
    const { id } = req.params;
    const article = await Article.findById(id)
    article.title = req.body.article.title;
    article.description = req.body.article.description;
    article.markdown = req.body.article.markdown;
    article.author = req.body.article.author;
    await article.save()
    req.flash('success', 'Successfully edited an article!')
    res.redirect(`/articles/${article._id}`)
}))

router.delete('/:id', isLoggedIn, catchAsync(async(req,res) => {
    const {id} = req.params;
    await Article.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted an article!')
    res.redirect('/articles')
}))

module.exports = router;