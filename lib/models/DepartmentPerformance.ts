import mongoose from 'mongoose';

const DepartmentPerformanceSchema = new mongoose.Schema({
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  departmentName: {
    type: String,
    required: true
  },
  month: {
    type: Number, // 1-12
    required: true
  },
  year: {
    type: Number, // e.g., 2024, 2025
    required: true
  },
  score: {
    type: Number, // 0-100 percentage
    required: true
  },
  employeeCount: {
    type: Number,
    required: true
  },
  machineCount: {
    type: Number,
    required: true
  },
  calculatedAt: {
    type: Date,
    default: Date.now
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Compound index for efficient querying by department and time period
DepartmentPerformanceSchema.index({ departmentId: 1, year: 1, month: 1 });
DepartmentPerformanceSchema.index({ year: 1, month: 1 });

const DepartmentPerformance = mongoose.models.DepartmentPerformance || mongoose.model('DepartmentPerformance', DepartmentPerformanceSchema);

export default DepartmentPerformance;
