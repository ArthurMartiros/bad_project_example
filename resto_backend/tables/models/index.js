const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let TableSchema = new Schema({
    chairs: {
        type: Number,
        minlength: 1,
        maxlength: 100
    },
    qr: {
        type: Schema.Types.ObjectId,
        ref: 'photos'
    },
    resto: {
        type: Schema.ObjectId,
        ref: 'restos',
        index: true
    },
    No: {
        type: Number,
    }
});

module.exports = TableSchema;
