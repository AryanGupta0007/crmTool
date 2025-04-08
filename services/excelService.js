const XLSX = require('xlsx');
const Lead = require('../models/Lead');

exports.processExcelFile = async (file) => {
  try {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const leads = XLSX.utils.sheet_to_json(worksheet);

    for (const leadData of leads) {
      const { name, contactNumber, email, status } = leadData;
      const lead = new Lead({ name, contactNumber, email, status });
      await lead.save();
    }

    return { success: true, message: 'Leads processed successfully' };
  } catch (error) {
    console.error('Error processing Excel file:', error);
    return { success: false, message: 'Error processing Excel file' };
  }
};

exports.parseExcel = (filePath) => {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(worksheet);
};

exports.processLeads = async (leads) => {
    // Check if leads already contain extended fields (e.g., "status")
    if (leads.length > 0 && leads[0].hasOwnProperty("status")) {
        // Extended file: return leads as-is (or additional processing if needed)
        return leads;
    } else {
        // Fallback: map fields from legacy file format
        return leads.map(lead => ({
            name: lead.name,
            contactNumber: lead.contact,  // map "contact" to contactNumber
            email: lead.email,
            source: lead.source,
            status: "new"
        }));
    }
};
