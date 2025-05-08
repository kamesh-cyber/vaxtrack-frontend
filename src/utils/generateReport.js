import { saveAs } from 'file-saver';
// import { Parser } from 'json2csv';
import ExcelJS from 'exceljs';

async function generateCSVReport(data) {
    try {
        // Extract headers
        const headers = Object.keys(data[0]);
        const csvRows = [];

        // Add headers to CSV
        csvRows.push(headers.join(','));

        // Add data rows to CSV
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header] !== null && row[header] !== undefined ? row[header] : '';
                return `"${String(value).replace(/"/g, '""')}"`; // Escape double quotes
            });
            csvRows.push(values.join(','));
        });

        // Create a Blob and trigger download
        const csvContent = csvRows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const fileName = `report-${Date.now()}.csv`;
        saveAs(blob, fileName);
    } catch (error) {
        throw new Error(`Error generating CSV report: ${error.message}`);
    }
}

// Generate Excel report
async function generateExcelReport(data) {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Report');

        // Add headers
        const headers = Object.keys(data[0]);
        worksheet.addRow(headers);

        // Add data rows
        data.forEach(row => {
            worksheet.addRow(Object.values(row));
        });

        const blob = await workbook.xlsx.writeBuffer();
        const fileName = `report-${Date.now()}.xlsx`;
        saveAs(new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), fileName);
    } catch (error) {
        throw new Error(`Error generating Excel report: ${error.message}`);
    }
}

// Generate PDF report
async function generatePDFReport(data) {
    try {
        const { jsPDF } = await import('jspdf'); // Dynamically import jsPDF
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(16);
        doc.text('Vaccination Report', 105, 20, { align: 'center' });

        // Extract headers
        const headers = Object.keys(data[0]);

        // Add table headers
        let yPos = 40;
        headers.forEach((header, index) => {
            doc.text(header, 10 + index * 40, yPos);
        });

        // Add table rows
        yPos += 10;
        data.forEach(row => {
            headers.forEach((header, index) => {
                const value = row[header] !== null && row[header] !== undefined ? String(row[header]) : '';
                doc.text(value, 10 + index * 40, yPos);
            });
            yPos += 10;
        });

        const blob = doc.output('blob');
        const fileName = `report-${Date.now()}.pdf`;
        saveAs(blob, fileName);
    } catch (error) {
        throw new Error(`Error generating PDF report: ${error.message}`);
    }
}

// Main function to generate report based on format
async function generateReport(data, format) {
    switch (format.toLowerCase()) {
        case 'csv':
            return generateCSVReport(data);
        case 'excel':
            return generateExcelReport(data);
        case 'pdf':
            return generatePDFReport(data);
        default:
            throw new Error('Unsupported format');
    }
}

export { generateReport };