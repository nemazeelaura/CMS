const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const Schema = mongoose.Schema;

//Post Schema
const PostSchema = new Schema({

     user: {

      type: Schema.Types.ObjectId,
      ref: 'users'

     },


     category: {
     
      type: Schema.Types.ObjectId,
      ref: 'categories'

     },


     title: {

        type: String,
        required: true

     },

     //holds id
     slug: {

     type: String

     },

     status: {

        type: String,
        default: 'public'

     },

     allowComments: {

        type: Boolean,
        require: true

     },

      body: {

        type: String,
        require: true

     },

       file: {

          type: String,

     },

       date: {

          type: Date,
          default: Date.now()

     },

       //array of ids
       comments: [{

       type: Schema.Types.ObjectId,
       ref: 'comments'

     }]
      //fixes deprecating unhandled promises
   }, {usePushEach: true});

PostSchema.plugin(URLSlugs('title', {field: 'slug'}));
// tells mongoose this is name of model posts, and pass in schema PostSchema
module.exports = mongoose.model('posts', PostSchema);










