import mongoose from "mongoose";

const AccessCodeSchema = new mongoose.Schema({
  codeAdm: {
    code: {
      type: String,
      sparse: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Adm',
      sparse: true
    }
  },

  codesModerator: [{
    code: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Moderator',
      sparse: true
    }
  }],
}, {
  timestamps: true,
});

export default mongoose.model('AccessCode', AccessCodeSchema);
