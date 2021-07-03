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
    },
    todoItems: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
})

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
