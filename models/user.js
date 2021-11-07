var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, maxLength: 100},
    total_time_studied: {type: Number, required: true, default: 0},
    start_time_stamp: {type: Number, required: true, default: 0},
    is_studying: {type: Boolean, required: true, default: false}
})

UserSchema
.virtual('url')
.get(function() {
    return '/' + this._id;
})

UserSchema
.virtual('time_formatted')
.get(function() {
    return formatMs(this.total_time_studied);
})

function formatMs(ms) {
    var totalSeconds = Math.floor(ms / 1000);
    var totalMinutes = Math.floor(totalSeconds / 60);
    var totalHours = Math.floor(totalMinutes / 60);
    return `${totalHours}hrs, ${totalMinutes%60}mins, ${totalSeconds%60}secs`
  }

module.exports = mongoose.model('User', UserSchema);