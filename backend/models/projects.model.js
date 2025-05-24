import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }],
    filetree: {
        type: Object,
        default: {

        }

    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model('Project', projectSchema);
export default Project;