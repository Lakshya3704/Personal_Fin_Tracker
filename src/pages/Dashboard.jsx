import Navbar from '../components/Navbar';
import SummaryCards from '../components/SummaryCards';
import FinancialCharts from '../components/FinancialCharts';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';
import ExportButton from '../components/ExportButton';
import BudgetCard from '../components/BudgetCard';
import GoalList from '../components/GoalList';
import { useFinance } from '../context/FinanceContext';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

const Dashboard = () => {
    const { transactions } = useFinance();
    const [dateFilter, setDateFilter] = useState('thisMonth');

    const filteredTransactions = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        if (dateFilter === 'all') return transactions;

        return transactions.filter(t => {
            let date;
            if (t.createdAt && t.createdAt.seconds) {
                date = new Date(t.createdAt.seconds * 1000);
            } else if (t.date) {
                date = new Date(t.date);
            } else {
                return false;
            }

            const itemsMonth = date.getMonth();
            const itemsYear = date.getFullYear();

            if (dateFilter === 'thisMonth') {
                return itemsMonth === currentMonth && itemsYear === currentYear;
            } else if (dateFilter === 'lastMonth') {
                const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                return itemsMonth === lastMonthDate.getMonth() && itemsYear === lastMonthDate.getFullYear();
            }
            return true;
        });
    }, [transactions, dateFilter]);

    const expenseTotal = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <Navbar />

            <main className="container" style={{ padding: '30px 20px', paddingBottom: '80px' }}>

                {/* Header */}
                <div className="flex-between" style={{ marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-main)' }}>Overview</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Here's what's happening with your finance.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                            style={{
                                padding: '10px 16px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-card)',
                                color: 'var(--text-main)',
                                outline: 'none',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="all">All Time</option>
                        </select>
                        <ExportButton />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Top Row: Summary Cards (Full Width) */}
                    <div style={{ marginBottom: '30px' }}>
                        <SummaryCards transactions={filteredTransactions} />
                    </div>

                    {/* Main Grid: Data (Left) vs Controls/Goals (Right) */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px' }}>

                        {/* Left Column (Charts & Lists) - Spans 8/12 (66%) on large screens */}
                        <div style={{ gridColumn: 'span 12', '@media (min-width: 1024px)': { gridColumn: 'span 8' }, lg: { gridColumn: 'span 8' } }} className="col-span-12 lg:col-span-8">
                            {/* I can't use tailwind classes here since it's vanilla CSS project. I'll use inline media query simulation or simple CSS Grid standard responsiveness */}
                        </div>

                        {/* Actually, let's use standard grid with auto-fit or flex, but to enforce sidebar, explicit columns are better if we want strict layout.
                            But for responsiveness without media queries in JS, we should use CSS classes.
                            Since we have Vanilla CSS, I'll rely on the existing container 'grid-template-columns: repeat(auto-fit...)' pattern or explicit flexbox.
                        */}
                    </div>

                    {/* Revised Layout using Flexbox for "Sidebar" pattern which wraps naturally */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>

                        {/* Left Main Column */}
                        <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <FinancialCharts transactions={filteredTransactions} />
                            <TransactionList transactions={filteredTransactions} />
                        </div>

                        {/* Right Sidebar Column */}
                        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <BudgetCard expenseTotal={expenseTotal} />
                            <GoalList />
                            <TransactionForm />
                        </div>

                    </div>

                </motion.div>

            </main>
        </div>
    );
};

export default Dashboard;
