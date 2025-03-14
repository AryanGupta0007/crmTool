const Lead = require('../models/lead');
const Employee = require('../models/employee');
const excelService = require('../services/excelService');

exports.addLeads = async (req, res) => {
    try {
        const leads = await excelService.parseExcel(req.file.path);
        const uniqueLeads = await Lead.insertMany(leads, { ordered: false });
        res.status(201).json(uniqueLeads);
    } catch (error) {
        res.status(500).json({ message: 'Error adding leads', error });
    }
};

exports.allotLeads = async (req, res) => {
    try {
        const { employeeId, leadIds } = req.body;
        const employee = await Employee.findById(employeeId);
        employee.leads.lead_details.push(...leadIds);
        employee.leads.alloted += leadIds.length;
        await employee.save();
        await Lead.updateMany({ _id: { $in: leadIds } }, { assignedTo: employeeId });
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error allotting leads', error });
    }
};