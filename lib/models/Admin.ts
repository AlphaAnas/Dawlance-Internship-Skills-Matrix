import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },

}, {
  timestamps: true
});

// Add indexes
AdminSchema.index({ is_deleted: 1 });
AdminSchema.index({ email: 1, is_deleted: 1 });

export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
