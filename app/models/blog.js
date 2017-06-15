/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
//var Mongoose  = require('mongoose');
var blogModel   = require('../database').models.blog;

var create = function (data, callback){
    var newBlog = new blogModel(data);
    newBlog.save(callback);
}

var find = function (data, callback){
    blogModel.find(data, callback);
}

var findOne = function (data, callback){
    blogModel.findOne(data, callback);
}

var findById = function (id, callback){
    blogModel.findById(id, callback);
}

// pass in the  {new: true} option to get back the updated version of your update. 
var findOneAndUpdate = function(query, data, options, callback){
    blogModel.findOneAndUpdate(query, data, options, callback);
}

var remove = function(data, callback){
    blogModel.remove(data, callback);
}

module.exports = { 
    create,
    find,
    findOne,
    findById,
    findOneAndUpdate,
    remove
};

