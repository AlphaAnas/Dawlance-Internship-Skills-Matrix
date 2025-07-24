import dbConnect from './mongodb';
import {
  Department,
  Manager,
  Employee,
  Skill,
  Machine,
  EmployeeSkill,
  EmployeeWorkHistory,
  SkillMatrix,
  ExportLog
} from './models';

export async function seedDatabase() {
  try {
    await dbConnect();
    console.log('Connected to MongoDB');

    // Clear existing data (optional - remove in production)
    await Department.deleteMany({});
    await Manager.deleteMany({});
    await Employee.deleteMany({});
    await Skill.deleteMany({});
    await Machine.deleteMany({});
    await EmployeeSkill.deleteMany({});
    await EmployeeWorkHistory.deleteMany({});
    await SkillMatrix.deleteMany({});
    await ExportLog.deleteMany({});

    console.log('Cleared existing data');

    // 1. Create Departments
    const departments = await Department.insertMany([
      { name: 'Sheet Metal', description: 'Metal cutting, forming and welding operations' },
      { name: 'Assembly Line', description: 'Product assembly and integration' },
      { name: 'Cooling Systems', description: 'Refrigeration system manufacturing and testing' },
      { name: 'Quality Control', description: 'Product testing and quality assurance' },
      { name: 'Painting', description: 'Surface preparation and painting operations' },
      { name: 'Packaging', description: 'Final packaging and shipping preparation' },
      { name: 'Blow Molding', description: 'Plastic component manufacturing' },
      { name: 'Maintenance', description: 'Equipment maintenance and repair' }
    ]);

    console.log('Created departments:', departments.length);

    // 2. Create Skills
    const skills = await Skill.insertMany([
      // Sheet Metal Skills
      { name: 'Metal Cutting', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[0]._id },
      { name: 'Welding', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id },
      { name: 'Press Brake Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id },
      { name: 'Blueprint Reading', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id },
      
      // Assembly Line Skills
      { name: 'Component Assembly', category: 'LABOUR', departmentId: departments[1]._id },
      { name: 'Torque Specifications', category: 'TECHNICAL', isCritical: true, departmentId: departments[1]._id },
      { name: 'Line Operations', category: 'MACHINE', isMachineRelated: true, departmentId: departments[1]._id },
      
      // Cooling Systems Skills
      { name: 'Refrigeration Systems', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id },
      { name: 'Leak Testing', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id },
      { name: 'Compressor Installation', category: 'TECHNICAL', departmentId: departments[2]._id },
      
      // Quality Control Skills
      { name: 'Quality Testing', category: 'TECHNICAL', isCritical: true, departmentId: departments[3]._id },
      { name: 'Statistical Analysis', category: 'TECHNICAL', departmentId: departments[3]._id },
      { name: 'Documentation', category: 'TECHNICAL', departmentId: departments[3]._id },
      
      // Painting Skills
      { name: 'Spray Painting', category: 'MACHINE', isMachineRelated: true, departmentId: departments[4]._id },
      { name: 'Surface Preparation', category: 'LABOUR', departmentId: departments[4]._id },
      { name: 'Color Matching', category: 'TECHNICAL', departmentId: departments[4]._id },
      
      // Packaging Skills
      { name: 'Package Assembly', category: 'LABOUR', departmentId: departments[5]._id },
      { name: 'Labeling', category: 'LABOUR', departmentId: departments[5]._id },
      { name: 'Shipping Documentation', category: 'TECHNICAL', departmentId: departments[5]._id },
      
      // Blow Molding Skills
      { name: 'Blow Molding Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[6]._id },
      { name: 'Plastic Welding', category: 'TECHNICAL', departmentId: departments[6]._id },
      { name: 'Mold Setup', category: 'TECHNICAL', isCritical: true, departmentId: departments[6]._id },
      
      // General Skills
      { name: 'Safety Protocols', category: 'SAFETY', isCritical: true },
      { name: 'Team Leadership', category: 'TECHNICAL' },
      { name: 'Problem Solving', category: 'TECHNICAL' },
      { name: 'Equipment Maintenance', category: 'TECHNICAL' }
    ]);

    console.log('Created skills:', skills.length);

    // 3. Create Machines
    const machines = await Machine.insertMany([
      // Sheet Metal Machines
      { name: 'Laser Cutter LX-500', machineId: 'LC-001', departmentId: departments[0]._id, type: 'Laser Cutter', manufacturer: 'TechCut', model: 'LX-500' },
      { name: 'Press Brake PB-200', machineId: 'PB-001', departmentId: departments[0]._id, type: 'Press Brake', manufacturer: 'MetalForm', model: 'PB-200' },
      { name: 'Welding Station WS-150', machineId: 'WS-001', departmentId: departments[0]._id, type: 'Welding Station', manufacturer: 'WeldTech', model: 'WS-150' },
      
      // Assembly Line Machines
      { name: 'Assembly Line AL-300', machineId: 'AL-001', departmentId: departments[1]._id, type: 'Assembly Line', manufacturer: 'AutoAssembly', model: 'AL-300' },
      { name: 'Torque Station TS-100', machineId: 'TS-001', departmentId: departments[1]._id, type: 'Torque Station', manufacturer: 'PrecisionTools', model: 'TS-100' },
      
      // Cooling Systems Machines
      { name: 'Compressor Tester CT-400', machineId: 'CT-001', departmentId: departments[2]._id, type: 'Compressor Tester', manufacturer: 'CoolTest', model: 'CT-400' },
      { name: 'Leak Detector LD-250', machineId: 'LD-001', departmentId: departments[2]._id, type: 'Leak Detector', manufacturer: 'LeakFind', model: 'LD-250' },
      
      // Painting Machines
      { name: 'Spray Booth SB-600', machineId: 'SB-001', departmentId: departments[4]._id, type: 'Spray Booth', manufacturer: 'PaintPro', model: 'SB-600' },
      { name: 'Paint Robot PR-800', machineId: 'PR-001', departmentId: departments[4]._id, type: 'Paint Robot', manufacturer: 'RoboPaint', model: 'PR-800' },
      
      // Blow Molding Machines
      { name: 'Blow Molder BM-350', machineId: 'BM-001', departmentId: departments[6]._id, type: 'Blow Molder', manufacturer: 'PlasticForm', model: 'BM-350' },
      { name: 'Injection Molder IM-450', machineId: 'IM-001', departmentId: departments[6]._id, type: 'Injection Molder', manufacturer: 'MoldMaster', model: 'IM-450' }
    ]);

    console.log('Created machines:', machines.length);

    // 4. Create Managers
    const managers = await Manager.insertMany([
      { name: 'Ayesha Khan', email: 'ayesha.khan@dawlance.com', employeeId: 'MGR-001', departmentId: departments[0]._id, phone: '+92-300-1111111' },
      { name: 'Ali Raza', email: 'ali.raza@dawlance.com', employeeId: 'MGR-002', departmentId: departments[1]._id, phone: '+92-300-1111112' },
      { name: 'Fatima Ahmed', email: 'fatima.ahmed@dawlance.com', employeeId: 'MGR-003', departmentId: departments[2]._id, phone: '+92-300-1111113' },
      { name: 'Usman Tariq', email: 'usman.tariq@dawlance.com', employeeId: 'MGR-004', departmentId: departments[3]._id, phone: '+92-300-1111114' },
      { name: 'Sana Malik', email: 'sana.malik@dawlance.com', employeeId: 'MGR-005', departmentId: departments[4]._id, phone: '+92-300-1111115' },
      { name: 'Bilal Hussain', email: 'bilal.hussain@dawlance.com', employeeId: 'MGR-006', departmentId: departments[5]._id, phone: '+92-300-1111116' },
      { name: 'Hira Shah', email: 'hira.shah@dawlance.com', employeeId: 'MGR-007', departmentId: departments[6]._id, phone: '+92-300-1111117' },
      { name: 'Hamza Sheikh', email: 'hamza.sheikh@dawlance.com', employeeId: 'MGR-008', departmentId: departments[7]._id, phone: '+92-300-1111118' }
    ]);

    console.log('Created managers:', managers.length);

    // 5. Create Employees
    const employees = await Employee.insertMany([
      // Sheet Metal Department
      { name: 'Mahira Iqbal', employeeId: 'EMP-001', departmentId: departments[0]._id, gender: 'Female', title: 'Senior Metal Worker', email: 'mahira.iqbal@dawlance.com', yearsExperience: 8 },
      { name: 'Imran Abbas', employeeId: 'EMP-002', departmentId: departments[0]._id, gender: 'Male', title: 'Metal Fabricator', email: 'imran.abbas@dawlance.com', yearsExperience: 6 },
      { name: 'Rabia Siddiqui', employeeId: 'EMP-003', departmentId: departments[0]._id, gender: 'Female', title: 'Metal Worker', email: 'rabia.siddiqui@dawlance.com', yearsExperience: 4 },
      { name: 'Fahad Mustafa', employeeId: 'EMP-004', departmentId: departments[0]._id, gender: 'Male', title: 'Welder', email: 'fahad.mustafa@dawlance.com', yearsExperience: 5 },
      
      // Assembly Line Department
      { name: 'Saba Yousaf', employeeId: 'EMP-005', departmentId: departments[1]._id, gender: 'Female', title: 'Assembly Technician', email: 'saba.yousaf@dawlance.com', yearsExperience: 3 },
      { name: 'Saad Farooq', employeeId: 'EMP-006', departmentId: departments[1]._id, gender: 'Male', title: 'Senior Assembler', email: 'saad.farooq@dawlance.com', yearsExperience: 7 },
      { name: 'Zara Javed', employeeId: 'EMP-007', departmentId: departments[1]._id, gender: 'Female', title: 'Assembly Worker', email: 'zara.javed@dawlance.com', yearsExperience: 2 },
      { name: 'Asad Mehmood', employeeId: 'EMP-008', departmentId: departments[1]._id, gender: 'Male', title: 'Line Supervisor', email: 'asad.mehmood@dawlance.com', yearsExperience: 10 },
      
      // Cooling Systems Department
      { name: 'Hina Qureshi', employeeId: 'EMP-009', departmentId: departments[2]._id, gender: 'Female', title: 'Refrigeration Technician', email: 'hina.qureshi@dawlance.com', yearsExperience: 6 },
      { name: 'Waleed Anwar', employeeId: 'EMP-010', departmentId: departments[2]._id, gender: 'Male', title: 'Senior Cooling Tech', email: 'waleed.anwar@dawlance.com', yearsExperience: 9 },
      { name: 'Nida Hassan', employeeId: 'EMP-011', departmentId: departments[2]._id, gender: 'Female', title: 'Systems Specialist', email: 'nida.hassan@dawlance.com', yearsExperience: 5 },
      
      // Quality Control Department
      { name: 'Areeba Shahid', employeeId: 'EMP-012', departmentId: departments[3]._id, gender: 'Female', title: 'QC Analyst', email: 'areeba.shahid@dawlance.com', yearsExperience: 7 },
      { name: 'Omar Siddiqui', employeeId: 'EMP-013', departmentId: departments[3]._id, gender: 'Male', title: 'Quality Inspector', email: 'omar.siddiqui@dawlance.com', yearsExperience: 4 },
      { name: 'Adeel Akhtar', employeeId: 'EMP-014', departmentId: departments[3]._id, gender: 'Male', title: 'Senior QC Inspector', email: 'adeel.akhtar@dawlance.com', yearsExperience: 8 },
      
      // Painting Department
      { name: 'Sania Mirza', employeeId: 'EMP-015', departmentId: departments[4]._id, gender: 'Female', title: 'Spray Painter', email: 'sania.mirza@dawlance.com', yearsExperience: 3 },
      { name: 'Zeeshan Ali', employeeId: 'EMP-016', departmentId: departments[4]._id, gender: 'Male', title: 'Paint Technician', email: 'zeeshan.ali@dawlance.com', yearsExperience: 5 },
      { name: 'Mehwish Hayat', employeeId: 'EMP-017', departmentId: departments[4]._id, gender: 'Female', title: 'Surface Prep Specialist', email: 'mehwish.hayat@dawlance.com', yearsExperience: 4 },
      
      // Packaging Department
      { name: 'Nimra Khan', employeeId: 'EMP-018', departmentId: departments[5]._id, gender: 'Female', title: 'Senior Packager', email: 'nimra.khan@dawlance.com', yearsExperience: 6 },
      { name: 'Yasir Nawaz', employeeId: 'EMP-019', departmentId: departments[5]._id, gender: 'Male', title: 'Packaging Operator', email: 'yasir.nawaz@dawlance.com', yearsExperience: 2 },
      { name: 'Aiman Khan', employeeId: 'EMP-020', departmentId: departments[5]._id, gender: 'Female', title: 'Shipping Coordinator', email: 'aiman.khan@dawlance.com', yearsExperience: 4 },
      
      // Blow Molding Department
      { name: 'Sadia Imam', employeeId: 'EMP-021', departmentId: departments[6]._id, gender: 'Female', title: 'Molding Operator', email: 'sadia.imam@dawlance.com', yearsExperience: 5 },
      { name: 'Shahzad Nawaz', employeeId: 'EMP-022', departmentId: departments[6]._id, gender: 'Male', title: 'Senior Mold Tech', email: 'shahzad.nawaz@dawlance.com', yearsExperience: 8 },
      { name: 'Humaima Malik', employeeId: 'EMP-023', departmentId: departments[6]._id, gender: 'Female', title: 'Plastic Specialist', email: 'humaima.malik@dawlance.com', yearsExperience: 3 }
    ]);

    console.log('Created employees:', employees.length);

    // 6. Create Employee Skills (assign skills to employees with various levels)
    const employeeSkills = [];
    const skillLevels = ['Low', 'Medium', 'High', 'Expert', 'Advanced'];
    
    // Assign skills to employees based on their departments
    for (const employee of employees) {
      // Get department-specific skills
      const departmentSkills = skills.filter(skill => 
        skill.departmentId?.toString() === employee.departmentId.toString()
      );
      
      // Add general skills
      const generalSkills = skills.filter(skill => !skill.departmentId);
      
      // Assign 3-6 skills per employee
      const skillsToAssign = [...departmentSkills, ...generalSkills]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 4) + 3);
      
      for (const skill of skillsToAssign) {
        employeeSkills.push({
          employeeId: employee._id,
          skillId: skill._id,
          level: skillLevels[Math.floor(Math.random() * skillLevels.length)],
          acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
          lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Random date within last month
        });
      }
    }

    await EmployeeSkill.insertMany(employeeSkills);
    console.log('Created employee skills:', employeeSkills.length);

    // 7. Create Sample Work History
    const workHistory = [];
    const shifts = ['DAY', 'NIGHT', 'EVENING'];
    
    for (let i = 0; i < 200; i++) {
      const employee = employees[Math.floor(Math.random() * employees.length)];
      const employeeSkillsForEmployee = employeeSkills.filter(es => 
        es.employeeId.toString() === employee._id.toString()
      );
      
      if (employeeSkillsForEmployee.length > 0) {
        const randomEmployeeSkill = employeeSkillsForEmployee[Math.floor(Math.random() * employeeSkillsForEmployee.length)];
        const departmentMachines = machines.filter(m => 
          m.departmentId.toString() === employee.departmentId.toString()
        );
        
        workHistory.push({
          employeeId: employee._id,
          departmentId: employee.departmentId,
          machineId: departmentMachines.length > 0 ? 
            departmentMachines[Math.floor(Math.random() * departmentMachines.length)]._id : null,
          skillId: randomEmployeeSkill.skillId,
          workDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 3 months
          hoursWorked: Math.floor(Math.random() * 4) + 6, // 6-10 hours
          productivity: Math.floor(Math.random() * 40) + 60, // 60-100%
          qualityScore: Math.floor(Math.random() * 30) + 70, // 70-100
          shift: shifts[Math.floor(Math.random() * shifts.length)]
        });
      }
    }

    await EmployeeWorkHistory.insertMany(workHistory);
    console.log('Created work history records:', workHistory.length);

    // 8. Create Sample Skill Matrices
    const skillMatrices = [];
    for (const department of departments) {
      const departmentSkills = skills.filter(skill => 
        skill.departmentId?.toString() === department._id.toString()
      );
      
      const matrixData = {
        departmentName: department.name,
        skills: departmentSkills.map(skill => ({
          skillId: skill._id,
          skillName: skill.name,
          category: skill.category,
          isCritical: skill.isCritical,
          requiredLevel: skillLevels[Math.floor(Math.random() * skillLevels.length)],
          employeeCoverage: Math.floor(Math.random() * 80) + 20 // 20-100% coverage
        })),
        lastUpdated: new Date()
      };

      skillMatrices.push({
        departmentId: department._id,
        name: `${department.name} Skill Matrix`,
        description: `Skill matrix for ${department.name} department`,
        matrixData: matrixData,
        version: '1.0',
        isActive: true,
        createdBy: managers.find(manager => 
          manager.departmentId.toString() === department._id.toString()
        )?._id
      });
    }

    await SkillMatrix.insertMany(skillMatrices);
    console.log('Created skill matrices:', skillMatrices.length);

    // 9. Create Sample Export Logs
    const exportLogs = [];
    const exportTypes = ['SKILL_MATRIX', 'EMPLOYEE_REPORT', 'PERFORMANCE_REPORT', 'WORK_HISTORY'];
    const statuses = ['COMPLETED', 'COMPLETED', 'COMPLETED', 'FAILED']; // Mostly completed

    for (let i = 0; i < 20; i++) {
      const manager = managers[Math.floor(Math.random() * managers.length)];
      const exportType = exportTypes[Math.floor(Math.random() * exportTypes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      exportLogs.push({
        managerId: manager._id,
        departmentId: manager.departmentId,
        exportType: exportType,
        fileName: `${exportType.toLowerCase()}_${Date.now()}.xlsx`,
        filePath: `/exports/${exportType.toLowerCase()}_${Date.now()}.xlsx`,
        status: status,
        recordCount: status === 'COMPLETED' ? Math.floor(Math.random() * 100) + 10 : 0,
        errorMessage: status === 'FAILED' ? 'Export timeout error' : ''
      });
    }

    await ExportLog.insertMany(exportLogs);
    console.log('Created export logs:', exportLogs.length);

    console.log('✅ Database seeded successfully!');
    
    return {
      departments: departments.length,
      managers: managers.length,
      employees: employees.length,
      skills: skills.length,
      machines: machines.length,
      employeeSkills: employeeSkills.length,
      workHistory: workHistory.length,
      skillMatrices: skillMatrices.length,
      exportLogs: exportLogs.length
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}
