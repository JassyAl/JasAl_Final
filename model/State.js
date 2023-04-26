const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* The Schema will have a stateCode property which is:
 i) a string
 ii) required
 iii) Unique
 */
const stateSchema  = new Schema({
    stateCode: {
        type: String, 
        required: true,
        unique: true
    },
    /* The Schema will also a funfacts property which is
    i) an array that contains string data 
    */
    funfacts: {
        type: [String],
    }, 
});

// by default will set State to lowerc and make plural
module.exports = mongoose.model('State', stateSchema);