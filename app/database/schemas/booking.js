/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
'use strict';

var Mongoose = require('mongoose');

var BookingSchema = new Mongoose.Schema({
    category: { type: String, required: true },
    username: { type: String, required: true },
    details: {type: String, required: true},
    datesubmitted: {type: Date, required: true},
    appointment: {type: String, enum: ['yes', 'no'], default: 'no'},
    treated: {type: String, enum: ['yes', 'no'], default: 'no'}    
    },  {
    timestamps: true
});

var bookingModel = Mongoose.model('booking', BookingSchema);

module.exports = bookingModel;

