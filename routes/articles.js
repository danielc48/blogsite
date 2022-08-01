const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressErrors');
const Article = require('../models/article');
const articles = require('../controllers/articles')
const {isLoggedIn, validateArticle, isAuthor} = require('../middleware')


router.route('/')
    .get(catchAsync(articles.index))
    .post(isLoggedIn, validateArticle, catchAsync(articles.createArticle))

router.get('/new', isLoggedIn, articles.renderNewForm)

router.route('/:id')
    .get(catchAsync(articles.showArticle))
    .put(isLoggedIn, isAuthor, validateArticle, catchAsync(articles.updateArticle))
    .delete(isLoggedIn, isAuthor, catchAsync(articles.deleteArticle))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(articles.renderEditForm))



module.exports = router;