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
  ExportLog,
  DepartmentPerformance
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
    await DepartmentPerformance.deleteMany({});

    console.log('Cleared existing data');

    // 1. Create Departments
    const departments = await Department.insertMany([
      { name: 'Sheet Metal', description: 'Metal cutting, forming and welding operations' },
      { name: 'Assembly Line', description: 'Product assembly and integration' },
      { name: 'Quality Control', description: 'Product testing and quality assurance' },
      { name: 'Welding', description: 'Welding operations and fabrication' },
      { name: 'Maintenance', description: 'Equipment maintenance and repair' }
    ]);

    console.log('Created departments:', departments.length);

    // 2. Create Skills for all departments
    const skills = await Skill.insertMany([
      // Sheet Metal Skills (Department 0) - Specific skills as requested
      { name: 'Shearing & Cutting Operations', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Press Operations', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Die Setting', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: '300 Ton Press', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'OLMA', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: '250 Ton Press', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Colmal Shearing', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Z-bottom Assembly', category: 'LABOUR', departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Heat Shrink Filling AMT', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Cutting / Flaring', category: 'TECHNICAL', departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Spot Welding', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'AMT Bending', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      
      // Assembly Line Skills (Department 1)
      { name: 'Assembly Line Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Component Assembly', category: 'LABOUR', departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Torque Specifications', category: 'TECHNICAL', isCritical: true, departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Quality Inspection', category: 'TECHNICAL', isCritical: true, departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Line Troubleshooting', category: 'TECHNICAL', departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Production Monitoring', category: 'TECHNICAL', departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Parts Handling', category: 'LABOUR', departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Tool Maintenance', category: 'TECHNICAL', departmentId: departments[1]._id, femaleEligible: true },
      
      // Quality Control Skills (Department 2)
      { name: 'CMM Operation', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Quality Testing', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Electrical Testing', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Dimensional Inspection', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Visual Inspection', category: 'TECHNICAL', departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Test Report Writing', category: 'TECHNICAL', departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Calibration Procedures', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      
      // Welding Skills (Department 3)
      { name: 'TIG Welding', category: 'TECHNICAL', isCritical: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'MIG Welding', category: 'TECHNICAL', isCritical: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Arc Welding', category: 'TECHNICAL', isCritical: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Gas Welding', category: 'TECHNICAL', departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Weld Inspection', category: 'TECHNICAL', isCritical: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Joint Preparation', category: 'TECHNICAL', departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Electrode Selection', category: 'TECHNICAL', departmentId: departments[3]._id, femaleEligible: true },
      
      // Maintenance Skills (Department 4)
      { name: 'Mechanical Maintenance', category: 'TECHNICAL', isCritical: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Electrical Maintenance', category: 'TECHNICAL', isCritical: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Hydraulic Systems', category: 'TECHNICAL', isCritical: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Pneumatic Systems', category: 'TECHNICAL', departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Preventive Maintenance', category: 'TECHNICAL', isCritical: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Troubleshooting', category: 'TECHNICAL', isCritical: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Equipment Repair', category: 'TECHNICAL', departmentId: departments[4]._id, femaleEligible: true }
    ]);

    console.log('Created skills:', skills.length);

    // 3. Create essential machines for each department
    const machines = await Machine.insertMany([
      // Sheet Metal Machines
      { name: '300 Ton Press', machineId: 'LC-001', departmentId: departments[0]._id, type: 'Press Machine', manufacturer: 'TechPress', model: '300T', status: 'ACTIVE', specifications: { capacity: '300 tons', workArea: '3000x1500mm' } },
      { name: '250 Ton Press', machineId: 'PB-001', departmentId: departments[0]._id, type: 'Press Machine', manufacturer: 'MetalForm', model: '250T', status: 'ACTIVE', specifications: { capacity: '250 tons', maxLength: '3200mm' } },
      { name: 'OLMA Machine', machineId: 'WS-001', departmentId: departments[0]._id, type: 'OLMA System', manufacturer: 'OLMA Tech', model: 'OLM-150', status: 'ACTIVE', specifications: { processes: ['cutting', 'forming'] } },
      { name: 'Colmal Shearing Machine', machineId: 'PC-001', departmentId: departments[0]._id, type: 'Shearing Machine', manufacturer: 'Colmal', model: 'CS-80', status: 'ACTIVE', specifications: { maxCutThickness: '50mm' } },
      { name: 'AMT Bending Machine', machineId: 'SMS-001', departmentId: departments[0]._id, type: 'Bending Machine', manufacturer: 'AMT Tech', model: 'AMT-3000', status: 'ACTIVE', specifications: { maxLength: '3000mm', maxThickness: '10mm' } },
      { name: 'Heat Shrink AMT', machineId: 'RF-001', departmentId: departments[0]._id, type: 'Heat Shrink System', manufacturer: 'AMT Systems', model: 'HS-120', status: 'ACTIVE', specifications: { maxWidth: '1200mm' } },
      
      // Assembly Line Machines
      { name: 'Assembly Line AL-300', machineId: 'AL-001', departmentId: departments[1]._id, type: 'Assembly Line', manufacturer: 'AutoAssembly', model: 'AL-300', status: 'ACTIVE', specifications: { length: '50m', speed: 'variable', stations: '15' } },
      { name: 'Torque Station TS-100', machineId: 'TS-001', departmentId: departments[1]._id, type: 'Torque Station', manufacturer: 'PrecisionTools', model: 'TS-100', status: 'ACTIVE', specifications: { torqueRange: '1-100Nm', accuracy: '±2%' } },
      
      // Quality Control Machines
      { name: 'CMM Measuring Machine', machineId: 'CMM-001', departmentId: departments[2]._id, type: 'CMM Machine', manufacturer: 'MeasurePro', model: 'CMM-500', status: 'ACTIVE', specifications: { accuracy: '±2µm', workVolume: '500x500x400mm' } },
      { name: 'Electrical Tester ET-1000', machineId: 'ET-001', departmentId: departments[2]._id, type: 'Electrical Tester', manufacturer: 'ElectroTest', model: 'ET-1000', status: 'ACTIVE', specifications: { voltage: '0-1000V', insulation: '0-10GΩ' } },
      
      // Welding Machines
      { name: 'TIG Welding Station', machineId: 'TIG-001', departmentId: departments[3]._id, type: 'Welding Station', manufacturer: 'WeldTech', model: 'TIG-250', status: 'ACTIVE', specifications: { amperage: '250A', processes: ['TIG'] } },
      { name: 'MIG Welding Station', machineId: 'MIG-001', departmentId: departments[3]._id, type: 'Welding Station', manufacturer: 'WeldTech', model: 'MIG-300', status: 'ACTIVE', specifications: { amperage: '300A', processes: ['MIG'] } },
      
      // Maintenance Equipment
      { name: 'Hydraulic Test Bench', machineId: 'HTB-001', departmentId: departments[4]._id, type: 'Test Bench', manufacturer: 'HydroTest', model: 'HTB-1000', status: 'ACTIVE', specifications: { maxPressure: '1000bar', flowRate: '100L/min' } },
      { name: 'Electrical Repair Station', machineId: 'ERS-001', departmentId: departments[4]._id, type: 'Electrical Repair', manufacturer: 'ElectroFix', model: 'ERS-500', status: 'ACTIVE', specifications: { voltage: '0-500V', instruments: 'complete' } }
    ]);

    /* COMMENTED OUT - Previous extensive machine list
    const machines = await Machine.insertMany([
      // Sheet Metal Machines
      { name: 'Laser Cutter LX-500', machineId: 'LC-001', departmentId: departments[0]._id, type: 'Laser Cutter', manufacturer: 'TechCut', model: 'LX-500', status: 'ACTIVE', specifications: { maxCutThickness: '20mm', power: '6kW', workArea: '3000x1500mm' } },
      { name: 'Press Brake PB-200', machineId: 'PB-001', departmentId: departments[0]._id, type: 'Press Brake', manufacturer: 'MetalForm', model: 'PB-200', status: 'ACTIVE', specifications: { bendForce: '200T', maxLength: '3200mm', backGauge: 'CNC' } },
      { name: 'Welding Station WS-150', machineId: 'WS-001', departmentId: departments[0]._id, type: 'Welding Station', manufacturer: 'WeldTech', model: 'WS-150', status: 'ACTIVE', specifications: { weldingTypes: ['TIG', 'MIG', 'Arc'], amperage: '150A' } },
      { name: 'Plasma Cutter PC-80', machineId: 'PC-001', departmentId: departments[0]._id, type: 'Plasma Cutter', manufacturer: 'CutPro', model: 'PC-80', status: 'ACTIVE', specifications: { maxCutThickness: '50mm', power: '80A' } },
      { name: 'Sheet Metal Shear SMS-3000', machineId: 'SMS-001', departmentId: departments[0]._id, type: 'Shear Machine', manufacturer: 'ShearMaster', model: 'SMS-3000', status: 'ACTIVE', specifications: { maxLength: '3000mm', maxThickness: '10mm' } },
      { name: 'Roll Former RF-120', machineId: 'RF-001', departmentId: departments[0]._id, type: 'Roll Former', manufacturer: 'FormTech', model: 'RF-120', status: 'ACTIVE', specifications: { maxWidth: '1200mm', rollStations: '12' } },
      
      // Assembly Line Machines
      { name: 'Assembly Line AL-300', machineId: 'AL-001', departmentId: departments[1]._id, type: 'Assembly Line', manufacturer: 'AutoAssembly', model: 'AL-300', status: 'ACTIVE', specifications: { length: '50m', speed: 'variable', stations: '15' } },
      { name: 'Torque Station TS-100', machineId: 'TS-001', departmentId: departments[1]._id, type: 'Torque Station', manufacturer: 'PrecisionTools', model: 'TS-100', status: 'ACTIVE', specifications: { torqueRange: '1-100Nm', accuracy: '±2%' } },
      { name: 'Pneumatic Press PP-500', machineId: 'PP-001', departmentId: departments[1]._id, type: 'Pneumatic Press', manufacturer: 'PressMatic', model: 'PP-500', status: 'ACTIVE', specifications: { force: '5000N', strokeLength: '150mm' } },
      { name: 'Screw Driver Station SDS-25', machineId: 'SDS-001', departmentId: departments[1]._id, type: 'Screw Driver', manufacturer: 'FastenTech', model: 'SDS-25', status: 'ACTIVE', specifications: { torqueRange: '0.1-25Nm', speed: '0-2000rpm' } },
      { name: 'Component Feeder CF-200', machineId: 'CF-001', departmentId: departments[1]._id, type: 'Component Feeder', manufacturer: 'FeedSys', model: 'CF-200', status: 'ACTIVE', specifications: { capacity: '200 parts', feedRate: '60/min' } },
      
      // Cooling Systems Machines
      { name: 'Compressor Tester CT-400', machineId: 'CT-001', departmentId: departments[2]._id, type: 'Compressor Tester', manufacturer: 'CoolTest', model: 'CT-400', status: 'ACTIVE', specifications: { testPressure: '40bar', refrigerants: ['R134a', 'R600a'] } },
      { name: 'Leak Detector LD-250', machineId: 'LD-001', departmentId: departments[2]._id, type: 'Leak Detector', manufacturer: 'LeakFind', model: 'LD-250', status: 'ACTIVE', specifications: { sensitivity: '1g/year', testMethods: ['Helium', 'Nitrogen'] } },
      { name: 'Refrigeration Assembly Station RAS-100', machineId: 'RAS-001', departmentId: departments[2]._id, type: 'Assembly Station', manufacturer: 'CoolBuild', model: 'RAS-100', status: 'ACTIVE', specifications: { workPositions: '4', toolsIncluded: 'yes' } },
      { name: 'Pressure Test Unit PTU-300', machineId: 'PTU-001', departmentId: departments[2]._id, type: 'Pressure Tester', manufacturer: 'TestMaster', model: 'PTU-300', status: 'ACTIVE', specifications: { maxPressure: '30bar', accuracy: '±0.1%' } },
      { name: 'Brazing Station BS-800', machineId: 'BS-001', departmentId: departments[2]._id, type: 'Brazing Station', manufacturer: 'BrazeTech', model: 'BS-800', status: 'ACTIVE', specifications: { temperature: '800°C', atmosphere: 'controlled' } },
      
      // Quality Control Machines
      { name: 'CMM Measuring Machine CMM-500', machineId: 'CMM-001', departmentId: departments[3]._id, type: 'CMM Machine', manufacturer: 'MeasurePro', model: 'CMM-500', status: 'ACTIVE', specifications: { accuracy: '±2µm', workVolume: '500x500x400mm' } },
      { name: 'Hardness Tester HT-150', machineId: 'HT-001', departmentId: departments[3]._id, type: 'Hardness Tester', manufacturer: 'HardTest', model: 'HT-150', status: 'ACTIVE', specifications: { methods: ['Rockwell', 'Brinell', 'Vickers'] } },
      { name: 'Surface Roughness Tester SRT-200', machineId: 'SRT-001', departmentId: departments[3]._id, type: 'Surface Tester', manufacturer: 'SurfaceCheck', model: 'SRT-200', status: 'ACTIVE', specifications: { range: '0.01-800µm', standards: ['ISO', 'ANSI'] } },
      { name: 'Electrical Tester ET-1000', machineId: 'ET-001', departmentId: departments[3]._id, type: 'Electrical Tester', manufacturer: 'ElectroTest', model: 'ET-1000', status: 'ACTIVE', specifications: { voltage: '0-1000V', insulation: '0-10GΩ' } },
      
      // Painting Machines
      { name: 'Spray Booth SB-600', machineId: 'SB-001', departmentId: departments[4]._id, type: 'Spray Booth', manufacturer: 'PaintPro', model: 'SB-600', status: 'ACTIVE', specifications: { dimensions: '6x4x3m', airflow: '20000m³/h', filtration: 'HEPA' } },
      { name: 'Paint Robot PR-800', machineId: 'PR-001', departmentId: departments[4]._id, type: 'Paint Robot', manufacturer: 'RoboPaint', model: 'PR-800', status: 'ACTIVE', specifications: { reach: '800mm', repeatability: '±0.05mm', axes: '6' } },
      { name: 'Powder Coating Station PCS-400', machineId: 'PCS-001', departmentId: departments[4]._id, type: 'Powder Coating', manufacturer: 'PowderTech', model: 'PCS-400', status: 'ACTIVE', specifications: { voltage: '100kV', flowRate: '500g/min' } },
      { name: 'Paint Mixing Station PMS-50', machineId: 'PMS-001', departmentId: departments[4]._id, type: 'Paint Mixer', manufacturer: 'MixMaster', model: 'PMS-50', status: 'ACTIVE', specifications: { capacity: '50L', mixingSpeed: '0-3000rpm' } },
      { name: 'Curing Oven CO-800', machineId: 'CO-001', departmentId: departments[4]._id, type: 'Curing Oven', manufacturer: 'HeatTech', model: 'CO-800', status: 'ACTIVE', specifications: { maxTemp: '200°C', volume: '8m³', uniformity: '±3°C' } },
      
      // Packaging Machines
      { name: 'Carton Erector CE-120', machineId: 'CE-001', departmentId: departments[5]._id, type: 'Carton Erector', manufacturer: 'PackTech', model: 'CE-120', status: 'ACTIVE', specifications: { speed: '12 cartons/min', cartonSize: '200-600mm' } },
      { name: 'Shrink Wrapper SW-300', machineId: 'SW-001', departmentId: departments[5]._id, type: 'Shrink Wrapper', manufacturer: 'WrapMaster', model: 'SW-300', status: 'ACTIVE', specifications: { filmWidth: '300mm', speed: '30 products/min' } },
      { name: 'Label Applicator LA-200', machineId: 'LA-001', departmentId: departments[5]._id, type: 'Label Applicator', manufacturer: 'LabelPro', model: 'LA-200', status: 'ACTIVE', specifications: { speed: '200 labels/min', accuracy: '±0.5mm' } },
      { name: 'Palletizer PZ-500', machineId: 'PZ-001', departmentId: departments[5]._id, type: 'Palletizer', manufacturer: 'PalletTech', model: 'PZ-500', status: 'ACTIVE', specifications: { capacity: '500kg', height: '2.5m', speed: '8 cycles/min' } },
      
      // Blow Molding Machines
      { name: 'Blow Molder BM-350', machineId: 'BM-001', departmentId: departments[6]._id, type: 'Blow Molder', manufacturer: 'PlasticForm', model: 'BM-350', status: 'ACTIVE', specifications: { clampForce: '350T', maxVolume: '5L', cycleTime: '45s' } },
      { name: 'Injection Molder IM-450', machineId: 'IM-001', departmentId: departments[6]._id, type: 'Injection Molder', manufacturer: 'MoldMaster', model: 'IM-450', status: 'ACTIVE', specifications: { clampForce: '450T', shotSize: '2000g', cycleTime: '30s' } },
      { name: 'Plastic Extruder PE-200', machineId: 'PE-001', departmentId: departments[6]._id, type: 'Extruder', manufacturer: 'ExtrudeTech', model: 'PE-200', status: 'ACTIVE', specifications: { screwDiameter: '200mm', output: '500kg/h' } },
      { name: 'Thermoforming Machine TM-120', machineId: 'TM-001', departmentId: departments[6]._id, type: 'Thermoformer', manufacturer: 'FormPlastic', model: 'TM-120', status: 'ACTIVE', specifications: { formingArea: '1200x800mm', depth: '150mm' } },
      
      // Maintenance Department Machines
      { name: 'CNC Lathe Repair Station CNC-300', machineId: 'CNCS-001', departmentId: departments[7]._id, type: 'Repair Station', manufacturer: 'RepairTech', model: 'CNC-300', status: 'ACTIVE', specifications: { capacity: '300mm dia', tooling: 'complete' } },
      { name: 'Welding Repair Unit WRU-250', machineId: 'WRU-001', departmentId: departments[7]._id, type: 'Welding Repair', manufacturer: 'FixWeld', model: 'WRU-250', status: 'ACTIVE', specifications: { processes: ['TIG', 'MIG', 'Stick'], amperage: '250A' } },
      { name: 'Hydraulic Test Bench HTB-1000', machineId: 'HTB-001', departmentId: departments[7]._id, type: 'Test Bench', manufacturer: 'HydroTest', model: 'HTB-1000', status: 'ACTIVE', specifications: { maxPressure: '1000bar', flowRate: '100L/min' } },
      { name: 'Electrical Repair Station ERS-500', machineId: 'ERS-001', departmentId: departments[7]._id, type: 'Electrical Repair', manufacturer: 'ElectroFix', model: 'ERS-500', status: 'ACTIVE', specifications: { voltage: '0-500V', instruments: 'complete' } }
    ]);
    */

    console.log('Created machines:', machines.length);

    // 4. Create Managers for each department
    const managers = await Manager.insertMany([
      { name: 'Ayesha Khan', email: 'ayesha.khan@dawlance.com', employeeId: 'MGR-001', departmentId: departments[0]._id, phone: '+92-300-1111111' },
      { name: 'Ali Raza', email: 'ali.raza@dawlance.com', employeeId: 'MGR-002', departmentId: departments[1]._id, phone: '+92-300-1111112' },
      { name: 'Fatima Ahmed', email: 'fatima.ahmed@dawlance.com', employeeId: 'MGR-003', departmentId: departments[2]._id, phone: '+92-300-1111113' },
      { name: 'Usman Tariq', email: 'usman.tariq@dawlance.com', employeeId: 'MGR-004', departmentId: departments[3]._id, phone: '+92-300-1111114' },
      { name: 'Sana Malik', email: 'sana.malik@dawlance.com', employeeId: 'MGR-005', departmentId: departments[4]._id, phone: '+92-300-1111115' }
    ]);

    console.log('Created managers:', managers.length);

    // 5. Create Employees with specific data as requested
    const employees = await Employee.insertMany([
      // Sheet Metal Department - Specific employees as requested
      { name: 'Abdul Shakoor', employeeId: 'EMP-001', departmentId: departments[0]._id, gender: 'Male', title: 'Senior Metal Worker', email: 'abdul.shakoor@dawlance.com', yearsExperience: 8 },
      { name: 'Imdad Hussain', employeeId: 'EMP-002', departmentId: departments[0]._id, gender: 'Male', title: 'Metal Fabricator', email: 'imdad.hussain@dawlance.com', yearsExperience: 6 },
      { name: 'Waseem Ahmed', employeeId: 'EMP-003', departmentId: departments[0]._id, gender: 'Male', title: 'Press Operator', email: 'waseem.ahmed@dawlance.com', yearsExperience: 4 },
      { name: 'Mumtaz Ali', employeeId: 'EMP-004', departmentId: departments[0]._id, gender: 'Male', title: 'Assembly Worker', email: 'mumtaz.ali@dawlance.com', yearsExperience: 5 },
      
      // Assembly Line Department
      { name: 'Saba Yousaf', employeeId: 'EMP-005', departmentId: departments[1]._id, gender: 'Female', title: 'Assembly Technician', email: 'saba.yousaf@dawlance.com', yearsExperience: 3 },
      { name: 'Saad Farooq', employeeId: 'EMP-006', departmentId: departments[1]._id, gender: 'Male', title: 'Senior Assembler', email: 'saad.farooq@dawlance.com', yearsExperience: 7 },
      { name: 'Zara Javed', employeeId: 'EMP-007', departmentId: departments[1]._id, gender: 'Female', title: 'Assembly Worker', email: 'zara.javed@dawlance.com', yearsExperience: 2 },
      { name: 'Asad Mehmood', employeeId: 'EMP-008', departmentId: departments[1]._id, gender: 'Male', title: 'Line Supervisor', email: 'asad.mehmood@dawlance.com', yearsExperience: 10 },
      
      // Quality Control Department
      { name: 'Areeba Shahid', employeeId: 'EMP-009', departmentId: departments[2]._id, gender: 'Female', title: 'QC Analyst', email: 'areeba.shahid@dawlance.com', yearsExperience: 7 },
      { name: 'Omar Siddiqui', employeeId: 'EMP-010', departmentId: departments[2]._id, gender: 'Male', title: 'Quality Inspector', email: 'omar.siddiqui@dawlance.com', yearsExperience: 4 },
      { name: 'Adeel Akhtar', employeeId: 'EMP-011', departmentId: departments[2]._id, gender: 'Male', title: 'Senior QC Inspector', email: 'adeel.akhtar@dawlance.com', yearsExperience: 8 },
      { name: 'Nida Hassan', employeeId: 'EMP-012', departmentId: departments[2]._id, gender: 'Female', title: 'Test Specialist', email: 'nida.hassan@dawlance.com', yearsExperience: 5 },
      
      // Welding Department
      { name: 'Hassan Malik', employeeId: 'EMP-013', departmentId: departments[3]._id, gender: 'Male', title: 'Senior Welder', email: 'hassan.malik@dawlance.com', yearsExperience: 9 },
      { name: 'Farah Sheikh', employeeId: 'EMP-014', departmentId: departments[3]._id, gender: 'Female', title: 'TIG Welder', email: 'farah.sheikh@dawlance.com', yearsExperience: 4 },
      { name: 'Ahmad Raza', employeeId: 'EMP-015', departmentId: departments[3]._id, gender: 'Male', title: 'MIG Welder', email: 'ahmad.raza@dawlance.com', yearsExperience: 6 },
      { name: 'Sana Qureshi', employeeId: 'EMP-016', departmentId: departments[3]._id, gender: 'Female', title: 'Welding Inspector', email: 'sana.qureshi@dawlance.com', yearsExperience: 5 },
      
      // Maintenance Department
      { name: 'Tariq Mahmood', employeeId: 'EMP-017', departmentId: departments[4]._id, gender: 'Male', title: 'Senior Technician', email: 'tariq.mahmood@dawlance.com', yearsExperience: 12 },
      { name: 'Hina Aslam', employeeId: 'EMP-018', departmentId: departments[4]._id, gender: 'Female', title: 'Electrical Technician', email: 'hina.aslam@dawlance.com', yearsExperience: 6 },
      { name: 'Bilal Khan', employeeId: 'EMP-019', departmentId: departments[4]._id, gender: 'Male', title: 'Mechanical Technician', email: 'bilal.khan@dawlance.com', yearsExperience: 8 },
      { name: 'Aisha Farooq', employeeId: 'EMP-020', departmentId: departments[4]._id, gender: 'Female', title: 'Maintenance Assistant', email: 'aisha.farooq@dawlance.com', yearsExperience: 3 }
    ]);

    /* COMMENTED OUT - Previous extensive employee list
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
    */

    console.log('Created employees:', employees.length);

    // 6. Create Employee Skills with specific skill levels (0-3 scale as requested)
    // Where 0 = no skill, 1 = basic/low, 2 = medium, 3 = high, 4 = expert
    const employeeSkills = [];
    
    // Define skill level mappings (0-4 scale)
    const skillLevelMap = {
      0: 'None',
      1: 'Low', 
      2: 'Medium',
      3: 'High',
      4: 'Expert'
    };

    // Sheet Metal Department Skills - Specific mappings for Abdul Shakoor, Imdad Hussain, Waseem Ahmed, Mumtaz Ali
    const sheetMetalEmployees = employees.filter(emp => emp.departmentId.toString() === departments[0]._id.toString());
    const sheetMetalSkills = skills.filter(skill => skill.departmentId?.toString() === departments[0]._id.toString());
    
    // Abdul Shakoor (EMP-001) - Senior Metal Worker with high skills
    const abdulShakoorSkillLevels = [3, 4, 2, 3, 2, 2, 3, 2, 1, 2, 3, 2]; // Sample skill levels 0-4
    sheetMetalSkills.forEach((skill, index) => {
      const level = abdulShakoorSkillLevels[index] || 1;
      employeeSkills.push({
        employeeId: sheetMetalEmployees[0]._id, // Abdul Shakoor
        skillId: skill._id,
        level: skillLevelMap[level],
        acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    });

    // Imdad Hussain (EMP-002) - Metal Fabricator
    const imdadHussainSkillLevels = [2, 3, 1, 2, 1, 3, 2, 1, 0, 2, 2, 1];
    sheetMetalSkills.forEach((skill, index) => {
      const level = imdadHussainSkillLevels[index] || 1;
      employeeSkills.push({
        employeeId: sheetMetalEmployees[1]._id, // Imdad Hussain
        skillId: skill._id,
        level: skillLevelMap[level],
        acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    });

    // Waseem Ahmed (EMP-003) - Press Operator
    const waseemAhmedSkillLevels = [1, 3, 2, 4, 1, 2, 1, 1, 0, 1, 1, 2];
    sheetMetalSkills.forEach((skill, index) => {
      const level = waseemAhmedSkillLevels[index] || 1;
      employeeSkills.push({
        employeeId: sheetMetalEmployees[2]._id, // Waseem Ahmed
        skillId: skill._id,
        level: skillLevelMap[level],
        acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    });

    // Mumtaz Ali (EMP-004) - Assembly Worker
    const mumtazAliSkillLevels = [2, 2, 1, 2, 0, 1, 2, 4, 2, 2, 2, 1];
    sheetMetalSkills.forEach((skill, index) => {
      const level = mumtazAliSkillLevels[index] || 1;
      employeeSkills.push({
        employeeId: sheetMetalEmployees[3]._id, // Mumtaz Ali
        skillId: skill._id,
        level: skillLevelMap[level],
        acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
        lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
      });
    });

    // Assembly Line Department Skills
    const assemblyEmployees = employees.filter(emp => emp.departmentId.toString() === departments[1]._id.toString());
    const assemblySkills = skills.filter(skill => skill.departmentId?.toString() === departments[1]._id.toString());
    
    assemblyEmployees.forEach((employee, empIndex) => {
      assemblySkills.forEach(skill => {
        const level = Math.floor(Math.random() * 5); // Random 0-4
        employeeSkills.push({
          employeeId: employee._id,
          skillId: skill._id,
          level: skillLevelMap[level],
          acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      });
    });

    // Quality Control Department Skills
    const qcEmployees = employees.filter(emp => emp.departmentId.toString() === departments[2]._id.toString());
    const qcSkills = skills.filter(skill => skill.departmentId?.toString() === departments[2]._id.toString());
    
    qcEmployees.forEach(employee => {
      qcSkills.forEach(skill => {
        const level = Math.floor(Math.random() * 5); // Random 0-4
        employeeSkills.push({
          employeeId: employee._id,
          skillId: skill._id,
          level: skillLevelMap[level],
          acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      });
    });

    // Welding Department Skills
    const weldingEmployees = employees.filter(emp => emp.departmentId.toString() === departments[3]._id.toString());
    const weldingSkills = skills.filter(skill => skill.departmentId?.toString() === departments[3]._id.toString());
    
    weldingEmployees.forEach(employee => {
      weldingSkills.forEach(skill => {
        const level = Math.floor(Math.random() * 5); // Random 0-4
        employeeSkills.push({
          employeeId: employee._id,
          skillId: skill._id,
          level: skillLevelMap[level],
          acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      });
    });

    // Maintenance Department Skills
    const maintenanceEmployees = employees.filter(emp => emp.departmentId.toString() === departments[4]._id.toString());
    const maintenanceSkills = skills.filter(skill => skill.departmentId?.toString() === departments[4]._id.toString());
    
    maintenanceEmployees.forEach(employee => {
      maintenanceSkills.forEach(skill => {
        const level = Math.floor(Math.random() * 5); // Random 0-4
        employeeSkills.push({
          employeeId: employee._id,
          skillId: skill._id,
          level: skillLevelMap[level],
          acquiredDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
          lastAssessedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        });
      });
    });

    await EmployeeSkill.insertMany(employeeSkills);
    console.log('Created employee skills:', employeeSkills.length);

    /* COMMENTED OUT - Previous employee skills logic
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
    */

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

    // 8. Create Skill Matrices for each department
    const skillMatrices = [];
    
    for (const department of departments) {
      const departmentSkills = skills.filter(skill => 
        skill.departmentId?.toString() === department._id.toString()
      );
      
      // Create matrixData in the format expected by the frontend
      const matrixData = {
        employees: employees.filter(emp => emp.departmentId.toString() === department._id.toString()),
        skills: departmentSkills.map(skill => skill.name), // Simple array of skill names
        skillLevels: {} // Will be populated with employee skill levels
      };

      // Populate skillLevels object with employee-skill combinations
      const deptEmployees = employees.filter(emp => emp.departmentId.toString() === department._id.toString());
      deptEmployees.forEach(employee => {
        departmentSkills.forEach(skill => {
          const level = Math.floor(Math.random() * 5); // Random 0-4
          const skillLevelMap = {
            0: 'None',
            1: 'Low', 
            2: 'Medium',
            3: 'High',
            4: 'Expert'
          };
          matrixData.skillLevels[`${employee.name}-${skill.name}`] = skillLevelMap[level];
        });
      });

      skillMatrices.push({
        departmentId: department._id,
        name: `${department.name} Skill Matrix`,
        description: `Skill matrix for ${department.name} department with 0-4 skill level scale (None, Low, Medium, High, Expert)`,
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

    /* COMMENTED OUT - Previous skill matrices logic
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
    */

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

    console.log('✅ Database seeded successfully with specific dummy data!');
    console.log('📋 Summary:');
    console.log('- Sheet Metal Department with Abdul Shakoor, Imdad Hussain, Waseem Ahmed, Mumtaz Ali');
    console.log('- 12 specific skills for Sheet Metal: Shearing & Cutting Operations, Press Operations, etc.');
    console.log('- Skill levels using 0-4 scale (0=None, 1=Low, 2=Medium, 3=High, 4=Expert)');
    console.log('- Complete skill matrices for all departments');
    
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



