const mongoose = require('mongoose');
const seedData = require('./article');
const Article = require('../models/article')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blogsite');
}

const seedDB = async() => {
    await Article.deleteMany({});
    for (let data of seedData) {
    const article = new Article(data)
    article.author = '62df9269bcb893323ffb8e01'
    await article.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})