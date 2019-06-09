const mongoose = require('mongoose')
const Schema = mongoose.Schema
var moment = require('moment');


var postSchema = new mongoose.Schema({
	body: String,
	subject: String,
	post_by: {type: Schema.Types.ObjectId, ref: 'user', required: true,}
}, {
 
  // 3
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

postSchema
  .virtual('url')
  .get(function () {
    return '/artical/' + this._id;
  });

postSchema
  .virtual('createdAt_formatted')
  .get(function() {
    return this.createdAt ? moment(this.createdAt).format('MMMM Do, YYYY') : '';
});

var Post = mongoose.model('Post', postSchema);

module.exports = Post
