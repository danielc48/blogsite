const mongoose = require('mongoose');
const seedData = require('./blogposts');
const Post = require('../models/blogPost')

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/blog');
}

const seedDB = async() => {
    await Post.deleteMany({});
    for (let data of seedData) {
    const blogpost = new Post(data)
    await blogpost.save()
    }
}

seedDB().then(()=>{
    mongoose.connection.close()
})