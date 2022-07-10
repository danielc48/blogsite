const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Article = require('./models/article') ;
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressErrors')
const {articleSchema} = require('./schemas')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blogsite');
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.engine('ejs', engine)


const validateArticle = (req,res,next) => {
    const {error} = articleSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join()
        throw new ExpressError(400,msg)
    } else {
        next();
    }
    
}

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/articles', catchAsync(async(req,res) => {
    const articles = await Article.find({}).sort({date: 'desc'});
    res.render('articles/index', {articles})
}));

app.get('/articles/new', (req,res) => {
    res.render('articles/new')
})

app.post('/articles', validateArticle, catchAsync(async (req,res) => {
    if (!req.body.article) throw new ExpressError(400, 'Invalid Campground Data')
    const article = new Article(req.body.article)
    await article.save();
    res.redirect(`/articles/${article._id}`)
}));

app.get('/articles/:id', catchAsync(async(req,res,next) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/show', {article})
}))

app.get('/articles/:id/edit', catchAsync(async(req,res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', {article})
}))

app.put('/articles/:id', validateArticle, catchAsync(async(req,res) => {
    const { id } = req.params;
    const article = await Article.findById(id)
    article.title = req.body.article.title;
    article.description = req.body.article.description;
    article.markdown = req.body.article.markdown;
    article.author = req.body.article.author;
    await article.save()
    res.redirect(`/articles/${article._id}`)
}))

app.delete('/articles/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await Article.findByIdAndDelete(id);
    res.redirect('/articles')
}))

app.all('*', (req,res,next) => {
    next(new ExpressError(404, "Page Not Found"))
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err
    if (!err.message) err.message = 'Oh no, something went wrong!'
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('listening on port 3000!')
})