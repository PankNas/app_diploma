import mongoose from "mongoose";
import User from './User.js';

const ModeratorSchema = new mongoose.Schema({
  codeAccess: {
    type: String,
    required: true,
  },
  reviewCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    sparse: true
  }]
}, {
  timestamps: true,
});

export default User.discriminator('Moderator', ModeratorSchema);
