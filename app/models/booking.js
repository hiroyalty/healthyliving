/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';
//var Mongoose  = require('mongoose');
var bookingModel   = require('../database').models.booking;

var create = function (data, callback){
	var newBooking = new bookingModel(data);
	newBooking.save(callback);
}


module.exports = { 
	create
};