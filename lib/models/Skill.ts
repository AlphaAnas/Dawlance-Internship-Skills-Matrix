import mongoose from 'mongoose';

const SkillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['MACHINE', 'LABOUR', 'TECHNICAL', 'SAFETY'],
    required: true
  },
  isMachineRelated: {
    type: Boolean,
    default: false
  },
  isCritical: {
    type: Boolean,
    default: false
  },
  femaleEligible: {
    type: Boolean,
    default: true
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add indexes
SkillSchema.index({ is_deleted: 1 });
SkillSchema.index({ category: 1, is_deleted: 1 });
SkillSchema.index({ departmentId: 1, is_deleted: 1 });

export default mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
