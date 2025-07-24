import { Model, Document } from 'mongoose';

// Utility functions for soft delete operations
export class SoftDeleteModel {
  private model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  // Find all non-deleted documents
  async findActive(filter: any = {}) {
    return this.model.find({ ...filter, is_deleted: false });
  }

  // Find one non-deleted document
  async findOneActive(filter: any = {}) {
    return this.model.findOne({ ...filter, is_deleted: false });
  }

  // Find by ID (non-deleted)
  async findByIdActive(id: string) {
    return this.model.findOne({ _id: id, is_deleted: false });
  }

  // Soft delete a document
  async softDelete(id: string) {
    return this.model.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );
  }

  // Soft delete multiple documents
  async softDeleteMany(filter: any = {}) {
    return this.model.updateMany(
      { ...filter, is_deleted: false },
      { is_deleted: true }
    );
  }

  // Restore a soft deleted document
  async restore(id: string) {
    return this.model.findByIdAndUpdate(
      id,
      { is_deleted: false },
      { new: true }
    );
  }

  // Permanently delete a document
  async hardDelete(id: string) {
    return this.model.findByIdAndDelete(id);
  }

  // Count non-deleted documents
  async countActive(filter: any = {}) {
    return this.model.countDocuments({ ...filter, is_deleted: false });
  }

  // Find with pagination (non-deleted)
  async findActiveWithPagination(
    filter: any = {},
    page: number = 1,
    limit: number = 10,
    sort: any = { createdAt: -1 }
  ) {
    const skip = (page - 1) * limit;
    
    const [data, total] = await Promise.all([
      this.model
        .find({ ...filter, is_deleted: false })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments({ ...filter, is_deleted: false })
    ]);

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
}

// Database service functions
export const DatabaseService = {
  // Get all employees with their department and skills
  async getEmployeesWithDetails() {
    const { Employee, Department, EmployeeSkill, Skill } = await import('./models');
    
    return Employee.aggregate([
      { $match: { is_deleted: false } },
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $lookup: {
          from: 'employee_skills',
          localField: '_id',
          foreignField: 'employeeId',
          as: 'employeeSkills'
        }
      },
      {
        $lookup: {
          from: 'skills',
          localField: 'employeeSkills.skillId',
          foreignField: '_id',
          as: 'skills'
        }
      },
      {
        $addFields: {
          department: { $arrayElemAt: ['$department', 0] },
          skillCount: { $size: '$skills' },
          averageSkillLevel: {
            $avg: {
              $map: {
                input: '$employeeSkills',
                as: 'empSkill',
                in: {
                  $switch: {
                    branches: [
                      { case: { $eq: ['$$empSkill.level', 'Low'] }, then: 1 },
                      { case: { $eq: ['$$empSkill.level', 'Medium'] }, then: 2 },
                      { case: { $eq: ['$$empSkill.level', 'High'] }, then: 3 },
                      { case: { $eq: ['$$empSkill.level', 'Expert'] }, then: 4 },
                      { case: { $eq: ['$$empSkill.level', 'Advanced'] }, then: 5 }
                    ],
                    default: 0
                  }
                }
              }
            }
          }
        }
      }
    ]);
  },

  // Get department performance metrics
  async getDepartmentMetrics() {
    const { Department, Employee, EmployeeSkill, EmployeeWorkHistory } = await import('./models');
    
    return Department.aggregate([
      { $match: { is_deleted: false } },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: 'departmentId',
          as: 'employees'
        }
      },
      {
        $lookup: {
          from: 'employee_work_history',
          localField: '_id',
          foreignField: 'departmentId',
          as: 'workHistory'
        }
      },
      {
        $addFields: {
          employeeCount: { $size: '$employees' },
          averageProductivity: { $avg: '$workHistory.productivity' },
          averageQualityScore: { $avg: '$workHistory.qualityScore' },
          totalHoursWorked: { $sum: '$workHistory.hoursWorked' }
        }
      }
    ]);
  },

  // Get skill matrix for a department
  async getSkillMatrixByDepartment(departmentId: string) {
    const { SkillMatrix, Skill, Employee, EmployeeSkill } = await import('./models');
    
    return SkillMatrix.aggregate([
      { 
        $match: { 
          departmentId: departmentId,
          is_deleted: false,
          isActive: true
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: 'departmentId',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $lookup: {
          from: 'managers',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy'
        }
      },
      {
        $addFields: {
          department: { $arrayElemAt: ['$department', 0] },
          createdBy: { $arrayElemAt: ['$createdBy', 0] }
        }
      }
    ]);
  }
};

export default DatabaseService;
