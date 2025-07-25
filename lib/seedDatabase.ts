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

    // 2. Create Skills with comprehensive coverage for each department
    const skills = await Skill.insertMany([
      // Sheet Metal Skills (Department 0)
      { name: 'Laser Cutting Operation', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Metal Cutting', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'TIG Welding', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'MIG Welding', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Arc Welding', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Press Brake Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Plasma Cutting', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Sheet Metal Shearing', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Roll Forming', category: 'MACHINE', isMachineRelated: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Blueprint Reading', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Metal Fabrication', category: 'TECHNICAL', isCritical: true, departmentId: departments[0]._id, femaleEligible: true },
      { name: 'Quality Measurement', category: 'TECHNICAL', departmentId: departments[0]._id, femaleEligible: true },
      
      // Assembly Line Skills (Department 1)
      { name: 'Assembly Line Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Component Assembly', category: 'LABOUR', departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Torque Specifications', category: 'TECHNICAL', isCritical: true, departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Pneumatic Press Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Screw Driver Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Component Feeding', category: 'MACHINE', isMachineRelated: true, departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Line Coordination', category: 'TECHNICAL', departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Assembly Quality Check', category: 'TECHNICAL', departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Production Scheduling', category: 'TECHNICAL', departmentId: departments[1]._id, femaleEligible: true },
      { name: 'Tool Maintenance', category: 'TECHNICAL', departmentId: departments[1]._id, femaleEligible: true },
      
      // Cooling Systems Skills (Department 2)
      { name: 'Compressor Testing', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Refrigeration Systems', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Leak Testing', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Compressor Installation', category: 'TECHNICAL', departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Refrigeration Assembly', category: 'TECHNICAL', departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Pressure Testing', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Brazing', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Refrigerant Handling', category: 'TECHNICAL', isCritical: true, departmentId: departments[2]._id, femaleEligible: true },
      { name: 'System Diagnostics', category: 'TECHNICAL', departmentId: departments[2]._id, femaleEligible: true },
      { name: 'Cooling System Design', category: 'TECHNICAL', departmentId: departments[2]._id, femaleEligible: true },
      
      // Quality Control Skills (Department 3)
      { name: 'CMM Operation', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Quality Testing', category: 'TECHNICAL', isCritical: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Hardness Testing', category: 'MACHINE', isMachineRelated: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Surface Roughness Testing', category: 'MACHINE', isMachineRelated: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Electrical Testing', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Statistical Analysis', category: 'TECHNICAL', departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Documentation', category: 'TECHNICAL', departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Calibration', category: 'TECHNICAL', isCritical: true, departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Dimensional Inspection', category: 'TECHNICAL', departmentId: departments[3]._id, femaleEligible: true },
      { name: 'Non-Destructive Testing', category: 'TECHNICAL', departmentId: departments[3]._id, femaleEligible: true },
      
      // Painting Skills (Department 4)
      { name: 'Spray Booth Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Spray Painting', category: 'MACHINE', isMachineRelated: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Paint Robot Programming', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Powder Coating', category: 'MACHINE', isMachineRelated: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Paint Mixing', category: 'MACHINE', isMachineRelated: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Surface Preparation', category: 'LABOUR', departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Color Matching', category: 'TECHNICAL', departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Curing Process Control', category: 'MACHINE', isMachineRelated: true, departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Paint Quality Control', category: 'TECHNICAL', departmentId: departments[4]._id, femaleEligible: true },
      { name: 'Coating Thickness Measurement', category: 'TECHNICAL', departmentId: departments[4]._id, femaleEligible: true },
      
      // Packaging Skills (Department 5)
      { name: 'Carton Erection', category: 'MACHINE', isMachineRelated: true, departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Shrink Wrapping', category: 'MACHINE', isMachineRelated: true, departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Label Application', category: 'MACHINE', isMachineRelated: true, departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Palletizing', category: 'MACHINE', isMachineRelated: true, departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Package Assembly', category: 'LABOUR', departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Labeling', category: 'LABOUR', departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Shipping Documentation', category: 'TECHNICAL', departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Inventory Management', category: 'TECHNICAL', departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Package Design', category: 'TECHNICAL', departmentId: departments[5]._id, femaleEligible: true },
      { name: 'Material Handling', category: 'LABOUR', departmentId: departments[5]._id, femaleEligible: true },
      
      // Blow Molding Skills (Department 6)
      { name: 'Blow Molding Operation', category: 'MACHINE', isMachineRelated: true, departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Injection Molding', category: 'MACHINE', isMachineRelated: true, isCritical: true, departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Plastic Extrusion', category: 'MACHINE', isMachineRelated: true, departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Thermoforming', category: 'MACHINE', isMachineRelated: true, departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Plastic Welding', category: 'TECHNICAL', departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Mold Setup', category: 'TECHNICAL', isCritical: true, departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Material Selection', category: 'TECHNICAL', departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Process Optimization', category: 'TECHNICAL', departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Plastic Testing', category: 'TECHNICAL', departmentId: departments[6]._id, femaleEligible: true },
      { name: 'Cycle Time Management', category: 'TECHNICAL', departmentId: departments[6]._id, femaleEligible: true },
      
      // Maintenance Skills (Department 7)
      { name: 'CNC Repair', category: 'TECHNICAL', isCritical: true, departmentId: departments[7]._id, femaleEligible: true },
      { name: 'Welding Repair', category: 'TECHNICAL', isCritical: true, departmentId: departments[7]._id, femaleEligible: true },
      { name: 'Hydraulic Systems', category: 'TECHNICAL', isCritical: true, departmentId: departments[7]._id, femaleEligible: true },
      { name: 'Electrical Repair', category: 'TECHNICAL', isCritical: true, departmentId: departments[7]._id, femaleEligible: false },
      { name: 'Mechanical Repair', category: 'TECHNICAL', isCritical: true, departmentId: departments[7]._id, femaleEligible: true },
      { name: 'Pneumatic Systems', category: 'TECHNICAL', departmentId: departments[7]._id, femaleEligible: true },
      { name: 'Preventive Maintenance', category: 'TECHNICAL', departmentId: departments[7]._id, femaleEligible: true },
      { name: 'Troubleshooting', category: 'TECHNICAL', isCritical: true, departmentId: departments[7]._id, femaleEligible: true },
      { name: 'Equipment Calibration', category: 'TECHNICAL', departmentId: departments[7]._id, femaleEligible: true },
      { name: 'Spare Parts Management', category: 'TECHNICAL', departmentId: departments[7]._id, femaleEligible: true },
      
      // General/Cross-Department Skills
      { name: 'Safety Protocols', category: 'SAFETY', isCritical: true, femaleEligible: true },
      { name: 'Team Leadership', category: 'TECHNICAL', femaleEligible: true },
      { name: 'Problem Solving', category: 'TECHNICAL', femaleEligible: true },
      { name: 'Equipment Maintenance', category: 'TECHNICAL', femaleEligible: true },
      { name: '5S Implementation', category: 'TECHNICAL', femaleEligible: true },
      { name: 'Lean Manufacturing', category: 'TECHNICAL', femaleEligible: true },
      { name: 'Six Sigma', category: 'TECHNICAL', femaleEligible: true },
      { name: 'Computer Literacy', category: 'TECHNICAL', femaleEligible: true },
      { name: 'Communication Skills', category: 'TECHNICAL', femaleEligible: true },
      { name: 'Time Management', category: 'TECHNICAL', femaleEligible: true }
    ]);

    console.log('Created skills:', skills.length);

    // 3. Create Machines with comprehensive coverage for each department
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
