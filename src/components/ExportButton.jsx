import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useFinance } from '../context/FinanceContext';

const ExportButton = () => {
    const { transactions } = useFinance();

    const generatePDF = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(20);
        doc.setTextColor(108, 93, 211); // Primary color
        doc.text("FinSet - Financial Statement", 14, 22);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Summary Logic
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((acc, curr) => acc + Number(curr.amount), 0);
        const balance = income - expense;

        // Summary Table
        autoTable(doc, {
            startY: 40,
            head: [['Total Income', 'Total Expense', 'Net Balance']],
            body: [[
                `Rs. ${income.toLocaleString('en-IN')}`,
                `Rs. ${expense.toLocaleString('en-IN')}`,
                `Rs. ${balance.toLocaleString('en-IN')}`
            ]],
            theme: 'grid',
            headStyles: { fillColor: [108, 93, 211] },
            styles: { fontSize: 12, cellPadding: 6 }
        });

        // Transactions Table
        // Format rows
        const tableRows = transactions.map(t => {
            const date = t.createdAt ? new Date(t.createdAt.seconds * 1000).toLocaleDateString() : '-';
            const type = t.type.charAt(0).toUpperCase() + t.type.slice(1);
            const amount = `Rs. ${Number(t.amount).toLocaleString('en-IN')}`;
            return [date, t.title, t.category, type, amount];
        });

        autoTable(doc, {
            startY: doc.lastAutoTable.finalY + 15,
            head: [['Date', 'Title', 'Category', 'Type', 'Amount']],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [36, 39, 49] }, // Dark Color
            alternateRowStyles: { fillColor: [245, 245, 245] }
        });

        doc.save('FinSet_Statement.pdf');
    };

    return (
        <button
            onClick={generatePDF}
            className="btn"
            style={{
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--primary-hover)'}
            onMouseOut={(e) => e.target.style.background = 'var(--primary)'}
        >
            <Download size={18} />
            Download PDF
        </button>
    );
};

export default ExportButton;
