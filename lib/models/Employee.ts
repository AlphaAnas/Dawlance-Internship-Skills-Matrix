import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  employeeId: {
    type: String,
    required: true,
    unique: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    default: ''
  },
  dateOfBirth: {
    type: Date
  },
  hireDate: {
    type: Date,
    default: Date.now
  },
  yearsExperience: {
    type: Number,
    default: 0
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes
EmployeeSchema.index({ is_deleted: 1 });
EmployeeSchema.index({ departmentId: 1, is_deleted: 1 });
// employeeId index is automatically created by unique: true

export default mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
