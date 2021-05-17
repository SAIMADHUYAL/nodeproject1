'use strict'
const mongoose = require('mongoose');
const contactdetailsSchema = mongoose.Schema({
    
    email: { type: String, trim: true,
        lowercase: true, required: true,
        required: true,
    },
    

  query: {
        type: String,
        require: true,
        trim: true,
    },
    
    

});
const contactdetails = mongoose.model('contactus', contactdetailsSchema);
module.exports = contactdetails;