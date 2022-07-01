const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Article = require('./models/article') ;
const methodOverride = require('method-override');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blog');
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/articles', async(req,res) => {
    const articles = await Article.find({});
    res.render('articles/index', {articles})
});

app.get('/articles/new', (req,res) => {
    res.render('articles/new')
})

app.post('/articles', async (req,res) => {
    const article = new Article(req.body.article)
    await article.save();
    res.redirect(`/articles/${article._id}`)
});

app.get('/articles/:id', async(req,res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/show', {article})
})

app.get('/articles/:id/edit', async(req,res) => {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', {article})
})

app.put('/articles/:id', async(req,res) => {
    const { id } = req.params;
    const article = await Article.findByIdAndUpdate(id, {...req.body.article});
    res.redirect(`/articles/${article._id}`)
})

app.delete('/articles/:id', async(req,res) => {
    const {id} = req.params;
    await Article.findByIdAndDelete(id);
    res.redirect('/articles')
})

app.listen(3000, () => {
    console.log('listening on port 3000!')
})