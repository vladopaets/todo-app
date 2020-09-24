const mongoose = require('mongoose');
const {Schema} = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: Schema.Types.Mixed
    }
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;