const mongoose = require('mongoose');
const seedData = require('./article');
const Article = require('../models/article')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blog');
}

const seedDB = async() => {
    await Article.deleteMany({});
    for (let data of seedData) {
    const article = new Article(data)
    await article.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})