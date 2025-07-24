import mongoose from 'mongoose';

const ManagerSchema = new mongoose.Schema({
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
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  phone: {
    type: String,
    default: ''
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes
ManagerSchema.index({ is_deleted: 1 });
ManagerSchema.index({ departmentId: 1, is_deleted: 1 });

export default mongoose.models.Manager || mongoose.model('Manager', ManagerSchema);
