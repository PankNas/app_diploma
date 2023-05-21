import mongoose from "mongoose";
import User from './User.js';

const AdmSchema = new mongoose.Schema({
  codeAccess: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

export default User.discriminator('Adm', AdmSchema);
