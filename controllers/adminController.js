const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const excelService = require('../services/excelService');

exports.addLeads = async (req, res) => {
    try {
        console.log("here")
        const leads = excelService.parseExcel(req.file.path);
        console.log(`leads ${leads}`)
        const uniqueLeads = await excelService.processLeads(leads);
        console.log(`unique ${uniqueLeads[0]}`)
        const filteredLeads = uniqueLeads.map(lead => ({
            name: lead.name,
            contactNumber: lead.contact,
            email: lead.email
        }));
        console.log(filteredLeads)
        const insertedLeads = [];
        for (const lead of filteredLeads) {
            const newLead = new Lead(lead);
            await newLead.save();
            insertedLeads.push(newLead);
        }

        res.status(201).json(insertedLeads);
    } catch (error) {
        console.log(`error adding leads ${error}`)
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

exports.getDashboardStats = async (req, res) => {
    try {
        const totalLeads = await Lead.countDocuments();
        const assignedLeads = await Lead.countDocuments({ assignedTo: { $ne: null } });
        const unassignedLeads = totalLeads - assignedLeads;
        const totalEmployees = await Employee.countDocuments();
        const recentActivities = []; // Add logic to fetch recent activities if needed

        res.status(200).json({
            totalLeads,
            assignedLeads,
            unassignedLeads,
            totalEmployees,
            recentActivities
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard stats', error });
    }
};

exports.getCallers = async (req, res) => {
    try {
        const callers = await Employee.find();
        res.status(200).json(callers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching callers', error });
    }
};

exports.getUnassignedLeads = async (req, res) => {
    try {
        const unassignedLeads = await Lead.find({ assignedTo: null });
        res.status(200).json(unassignedLeads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching unassigned leads', error });
    }
};

exports.getLeads = async (req, res) => {
    try {
        const leads = await Lead.find();
        res.status(200).json(leads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leads', error });
    }
};

exports.assignLead = async (req, res) => {
    try {
        const { leadId, callerId } = req.body;
        const lead = await Lead.findById(leadId);
        lead.assignedTo = callerId;
        await lead.save();
        res.status(200).json(lead);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning lead', error });
    }
};

exports.getRevenue = async (req, res) => {
    try {
        // Replace with actual revenue calculation logic
        const totalRevenue = 5700;
        res.status(200).json(totalRevenue);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching revenue', error });
    }
};

exports.getSalesLeads = async (req, res) => {
    try {
        const salesLeads = await Lead.find({ status: 'closed-success' });
        res.status(200).json(salesLeads);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sales leads', error });
    }
};