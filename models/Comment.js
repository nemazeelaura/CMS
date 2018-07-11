const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Category Schema
const CommentSchema = new Schema({

	user: {

		type: Schema.Types.ObjectId,
		ref: 'users'

	},


     body: {

        type: String,
        required: true

     },

       approveComment: {

        type: Boolean

     },

      date: {

        type: Date,
        default: Date.now()

     }

});
// tells mongoose this is name of model schema, and pass in schema CommentSchema
module.exports = mongoose.model('comments', CommentSchema);
