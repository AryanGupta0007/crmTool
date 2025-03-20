const Lead = require('../models/Lead');
const Employee = require('../models/Employee');
const Batch = require('../models/Batch');
const excelService = require('../services/excelService');
const { Parser } = require('json2csv');

exports.addLeads = async (req, res) => {
    try {
        // console.log("here")
        const leads = excelService.parseExcel(req.file.path);
        // console.log(`leads ${leads}`)
        const uniqueLeads = await excelService.processLeads(leads);
        // console.log(`unique ${uniqueLeads[0]}`)
        const filteredLeads = uniqueLeads.map(lead => ({
            name: lead.name,
            contactNumber: lead.contact,
            email: lead.email
        }));
        // console.log(filteredLeads)
        const insertedLeads = [];
        for (const lead of filteredLeads) {
            const newLead = new Lead(lead);
            await newLead.save();
            insertedLeads.push(newLead);
        }
        console.log(`inserted leads: ${insertedLeads}`)

        // Automatically allot leads to sales employees
        await exports.autoAllotLeads(insertedLeads);

        res.status(201).json(insertedLeads);
    } catch (error) {
        console.log(`error adding leads ${error}`)
        res.status(500).json({ message: 'Error adding leads', error });
    }
};

exports.autoAllotLeads = async (leads) => {
    try {
        const salesEmployees = await Employee.find({ type: 'sales' });
        console.log(salesEmployees)
        if (salesEmployees.length === 0) {
            console.log('No sales employees found');
            return;
        }

        let employeeIndex = 0;
        const employeeLeadCounts = salesEmployees.map(employee => ({
            employee,
            allotted: 0
        }));

        for (const lead of leads) {
            console.log(`lead: ${lead}`)
            let attempts = 0;
            while (employeeLeadCounts[employeeIndex].allotted >= employeeLeadCounts[employeeIndex].employee.leads.needed) {
                console.log(`index: ${employeeIndex}`)
                employeeIndex = (employeeIndex + 1) % salesEmployees.length;
                attempts++;
                if (attempts >= salesEmployees.length) {
                    console.log('All employees have reached their needed leads limit');
                    return;
                }
            }   

            const employeeLeadCount = employeeLeadCounts[employeeIndex];
            console.log(`employeeLeadCount: ${employeeLeadCount}`)
            employeeLeadCount.employee.leads.lead_details.push(lead._id);
            employeeLeadCount.employee.leads.alloted += 1; // Increase the alloted value
            employeeLeadCount.allotted += 1;
            await employeeLeadCount.employee.save();

            lead.assignedTo = employeeLeadCount.employee._id;
            await lead.save();

            employeeIndex = (employeeIndex + 1) % salesEmployees.length;
        }

        console.log('Leads auto-allotted to sales employees');
        return 
    } catch (error) {
        console.log(`Error auto-allotting leads: ${error}`);
        return
    }
};

exports.updateNeededLeads = async (req, res) => {
    try {
        const { id } = req.params;
        const { neededLeads } = req.body;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        // console.log(`employee leads: ${employee.leads}`)
        employee.leads.needed = neededLeads;
        await employee.save();
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: 'Error updating needed leads', error });
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
        const callers = await Employee.find({ type: "sales" });
        // console.log(`Callers ${callers}`)
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
        const leads = await Lead.find({ status: 'closed-success', operationStatus: 'completed' });
        const totalRevenue = leads.reduce((sum, lead) => sum + parseFloat(lead.amount || 0), 0);
        res.status(200).json({ totalRevenue });
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

exports.downloadEmployeeLeads = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const leads = await Lead.find({ assignedTo: employeeId });

        if (!leads.length) {
            return res.status(404).json({ message: 'No leads found for this employee' });
        }

        const fields = [
            'name',
            'contactNumber',
            'email',
            'status',
            'boardsPass',
            'boardsEnglish',
            'boardsPCM',
            'followUpDate',
            'salesStatus',
            'batch',
            'formSs',
            'books',
            'booksSs',
            'assignedTo',
            'paymentVerified',
            'amount',
            'comment',
            'paymentProof',
            'addedToGroup',
            'registeredOnApp'
        ];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(leads);

        res.header('Content-Type', 'text/csv');
        res.attachment(`employee_${employeeId}_leads.csv`);
        res.send(csv);
    } catch (error) {
        console.error('Error downloading leads:', error);
        res.status(500).json({ message: 'Error downloading leads', error });
    }
};

exports.addBatch = async(req, res) => {
    try{
        const {name, price, booksPrice} = req.body;
        const batch = new Batch({
            name,
            price,
            booksPrice
        })
        await batch.save()
        res.status(200).json({batch})
    }
    catch(error){
        res.status(500).json({error})

    }
}

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Option 1: Remove the employee from the database
        // await employee.remove();

        // Option 2: Update the employee's status to "deleted"
        employee.status = "deleted";
        await employee.save();

        res.status(200).json({ message: 'Employee and assigned leads removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee', error });
    }
};

exports.getBatches = async (req, res) => {
    try {
        const batches = await Batch.find();
        res.status(200).json(batches);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching batches', error });
    }
};