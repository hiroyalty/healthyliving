'use strict';

var Mongoose  = require('mongoose');

/**
 * Each connection object represents a user connected through a unique socket.
 * Each connection object composed of {userId + socketId}. Both of them together are unique.
 *
 */
var RoomSchema = new Mongoose.Schema({
    title: { type: String, unique: true, required: true },
    connections: { type: [{ userId: String, socketId: String }]},
    maxmember: {type: Number, default: 2},
    roomtype: {type: String, enum: ['public', 'private'], default: 'private'},
    status: {type: String, enum: ['started','end'], default: 'started'}
}, {
    timestamps: true
});

var roomModel = Mongoose.model('room', RoomSchema);

module.exports = roomModel;