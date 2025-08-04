// import mongoose from 'mongoose';

// const MachineSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   machineId: {
//     type: String,
//     required: true,
//     unique: true
//   },
//   departmentId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Department',
//     required: true
//   },
//   type: {
//     type: String,
//     required: true // e.g., 'Press Brake', 'Welding Machine', 'Assembly Line'
//   },
//   manufacturer: {
//     type: String,
//     default: ''
//   },
//   model: {
//     type: String,
//     default: ''
//   },
//   status: {
//     type: String,
//     enum: ['ACTIVE', 'MAINTENANCE', 'INACTIVE'],
//     default: 'ACTIVE'
//   },
//   installDate: {
//     type: Date
//   },
//   lastMaintenanceDate: {
//     type: Date
//   },
//   specifications: {
//     type: Object,
//     default: {}
//   },
//   is_deleted: {
//     type: Boolean,
//     default: false
//   }
// }, {
//   timestamps: true
// });

// // Add indexes
// MachineSchema.index({ is_deleted: 1 });
// MachineSchema.index({ departmentId: 1, is_deleted: 1 });
// // machineId index is automatically created by unique: true
// MachineSchema.index({ status: 1, is_deleted: 1 });

// export default mongoose.models.Machine || mongoose.model('Machine', MachineSchema);
