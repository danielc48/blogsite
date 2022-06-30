const express = require('express');
const app = express()
const path = require('path');
const mongoose = require('mongoose');
const Post = require('./models/blogPost') 

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blog');
}

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req,res) => {
    res.render('home')
})

app.get('/posts', async(req,res) => {
    const posts = await Post.find({});
    res.render('index', {posts})
} )

app.listen(3000, () => {
    console.log('listening on post 3000!')
})