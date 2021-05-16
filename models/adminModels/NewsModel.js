const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsModel = new Schema({
    title: {type:String},
    description: {type:String},
    url: {type:String},
    url_to_image: {type:String},
    publishedat: {type:String},
    insertTime: {type:Number}
})

// model name : news
// collection name : news
module.exports = mongoose.model('news', newsModel, 'news');