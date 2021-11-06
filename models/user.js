var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    total_time_studied: {type: Number, required: true, default: 0},
    start_time_stamp: {type: Number, required: true, default: 0},
    is_studying: {type: Boolean, required: true, default: false}
})

module.exports = mongoose.model('User', UserSchema);