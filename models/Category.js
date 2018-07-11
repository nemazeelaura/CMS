const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Category Schema
const CategorySchema = new Schema({


     name: {

        type: String,
        required: true

     }

});
// tells mongoose this is name of model schema, and pass in schema CategorySchema
module.exports = mongoose.model('categories', CategorySchema);
