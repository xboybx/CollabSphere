import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters'],
        maxlength: [50, 'Email must be at most 50 characters']
    },
    password: {
        type: String,
        select: false,
    }
});

userSchema.statics.hashpassword = async (password) => {
    return bcrypt.hash(password, 10);
};

userSchema.methods.ComparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
    return jwt.sign({ id: this._id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const user = mongoose.model('User', userSchema);
export default user;