import {
    PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { useFinance } from '../context/FinanceContext';

const COLORS = ['#6C5DD3', '#FF754C', '#3DD2CC', '#FFAB00', '#FF5B5B', '#242731', '#808191'];

const FinancialCharts = ({ transactions }) => {

    // Prepare Data for Pie Chart (Expenses by Category)
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    const categoryData = expenseTransactions.reduce((acc, curr) => {
        const existing = acc.find(item => item.name === curr.category);
        if (existing) {
            existing.value += Number(curr.amount);
        } else {
            acc.push({ name: curr.category, value: Number(curr.amount) });
        }
        return acc;
    }, []);

    // Prepare Data for Bar Chart (Income vs Expense)
    const incomeTotal = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const expenseTotal = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);

    const barData = [
        { name: 'Income', amount: incomeTotal },
        { name: 'Expense', amount: expenseTotal }
    ];

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val);
    };

    if (transactions.length === 0) {
        return (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
                Add transactions to see analytics
            </div>
        );
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '30px' }}>

            {/* Pie Chart */}
            <div className="card" style={{ height: '350px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Expense by Category</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--text-main)' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <Legend verticalAlign="middle" align="right" layout="vertical" />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="card" style={{ height: '350px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '20px' }}>Income vs Expense</h3>
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={barData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)' }} />
                        <RechartsTooltip
                            cursor={{ fill: 'var(--bg-body)' }}
                            contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                            itemStyle={{ color: 'var(--text-main)' }}
                            formatter={(value) => formatCurrency(value)}
                        />
                        <Bar dataKey="amount" fill="var(--primary)" radius={[8, 8, 0, 0]}>
                            {barData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.name === 'Income' ? 'var(--success)' : 'var(--danger)'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default FinancialCharts;
