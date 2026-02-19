import { ArrowUpRight, ArrowDownRight, DollarSign, PiggyBank } from 'lucide-react';

const SummaryCard = ({ title, amount, type }) => {
    let color = 'var(--text-main)';
    let bgIcon = '#E2E8F0';
    let iconColor = 'var(--text-main)';
    let Icon = DollarSign;

    if (type === 'income') {
        color = 'var(--success)';
        bgIcon = 'rgba(61, 210, 204, 0.15)';
        iconColor = 'var(--success)';
        Icon = ArrowUpRight;
    } else if (type === 'expense') {
        color = 'var(--danger)';
        bgIcon = 'rgba(255, 91, 91, 0.15)';
        iconColor = 'var(--danger)';
        Icon = ArrowDownRight;
    } else if (type === 'balance') {
        color = 'var(--primary)';
        bgIcon = 'rgba(108, 93, 211, 0.15)';
        iconColor = 'var(--primary)';
    } else if (type === 'savings') {
        color = '#FFAB00';
        bgIcon = 'rgba(255, 171, 0, 0.15)';
        iconColor = '#FFAB00';
        Icon = PiggyBank;
    }

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val);
    };

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="flex-between">
                <span style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500' }}>{title}</span>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: bgIcon,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: iconColor
                }}>
                    <Icon size={20} />
                </div>
            </div>

            <div>
                <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-main)', marginBottom: '5px' }}>
                    {formatCurrency(amount)}
                </h2>
                {type !== 'balance' && type !== 'savings' && (
                    <div className="flex-center" style={{ justifyContent: 'flex-start', gap: '5px' }}>
                        <span style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: type === 'income' ? 'var(--success)' : 'var(--danger)',
                            background: type === 'income' ? 'rgba(61, 210, 204, 0.1)' : 'rgba(255, 91, 91, 0.1)',
                            padding: '4px 8px',
                            borderRadius: '6px'
                        }}>
                            {type === 'income' ? '+1.2%' : '-0.5%'}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>from last month</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const SummaryCards = ({ transactions }) => {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const expense = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const savings = transactions
        .filter(t => t.type === 'savings')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const balance = income - expense - savings; // Assuming savings reduces available balance, OR it's a separate bucket? 
    // Usually Balance = Income - Expense. If Savings is a transaction type, is it an expense? 
    // In TransactionForm, 'savings' is a type. If I treat it as a transfer to a goal, it's an expense from the 'Wallet' perspective but an asset in 'Goals'.
    // For net worth (Balance), it should typically still be there unless 'Balance' means 'Spendable Cash'.
    // Let's assume Balance = Income - Expense (where Expense includes spending). 
    // Does Savings count as Expense in the calculation? 
    // If I select 'savings', it's money moving out of 'Spendable'. So Balance = Income - Expense - Savings.
    // Let's stick to that for now.

    const totalBalance = income - expense - savings;

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', // Reduced minmax to fit 4 cards better
            gap: '24px',
            marginBottom: '30px'
        }}>
            <SummaryCard title="Total Balance" amount={totalBalance} type="balance" />
            <SummaryCard title="Total Income" amount={income} type="income" />
            <SummaryCard title="Total Expense" amount={expense} type="expense" />
            <SummaryCard title="Total Savings" amount={savings} type="savings" />
        </div>
    );
};

export default SummaryCards;
