'use strict';
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Mongoose = require('mongoose');

var BlogSchema = new Mongoose.Schema({
    category: { type: String, required: true },
    title: { type: String, required: true },
    teaser: {type: String, required: true},
    details: {type: String, required: true},
    blogimage: {type: String, required: true},
    datepublished: {type: Date, required: true},
    dateexpired: {type: Date, required: true},
    dateupdated: {type: Date, required: true},
    published: {type: String, enum: ['yes', 'no'], default: 'no'}
    },  {
    timestamps: true
});

var blogModel = Mongoose.model('blog', BlogSchema);

module.exports = blogModel;
/*
module.exports = mongoose.model('Blog',{
	id: String,
	category: String,
	title: String,
	teaser: String,
	details: String,
	blogimage: String,
	datepublished: Date,
	dateexpired: Date,
	dateupdated: Date,
	published: {type: String, enum: ['yes', 'no']}
});
*/
