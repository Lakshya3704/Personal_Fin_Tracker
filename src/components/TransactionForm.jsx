import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus } from 'lucide-react';

const TransactionForm = () => {
    const { addTransaction, goals, updateGoal } = useFinance();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [selectedGoal, setSelectedGoal] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title || !amount) return;

        // If it's a savings transaction linked to a goal
        if (type === 'savings' && selectedGoal) {
            const goal = goals.find(g => g.id === selectedGoal);
            if (goal) {
                updateGoal(goal.id, { currentAmount: goal.currentAmount + Number(amount) });
            }
        }

        addTransaction({
            title,
            amount: Number(amount),
            type, // income, expense, or savings
            category: type === 'savings' ? 'Savings' : category,
            goalId: selectedGoal || null,
            date: new Date().toISOString()
        });

        setTitle('');
        setAmount('');
        setCategory('');
        setSelectedGoal('');
    };

    return (
        <div className="card">
            <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Add Transaction</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Type Selector */}
                <div style={{ display: 'flex', background: 'var(--bg-body)', padding: '4px', borderRadius: '12px' }}>
                    {['expense', 'income', 'savings'].map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            style={{
                                flex: 1,
                                padding: '10px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                background: type === t ? 'var(--bg-card)' : 'transparent',
                                color: type === t ? (t === 'expense' ? 'var(--danger)' : t === 'income' ? 'var(--success)' : 'var(--primary)') : 'var(--text-muted)',
                                boxShadow: type === t ? 'var(--shadow-sm)' : 'none',
                                transition: 'all 0.2s',
                                textTransform: 'capitalize'
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Groceries"
                        style={{
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-body)',
                            color: 'var(--text-main)',
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>Amount</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            style={{
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-body)',
                                color: 'var(--text-main)',
                                outline: 'none'
                            }}
                        />
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-muted)' }}>
                            {type === 'savings' ? 'Link to Goal (Optional)' : 'Category'}
                        </label>

                        {type === 'savings' ? (
                            <select
                                value={selectedGoal}
                                onChange={(e) => setSelectedGoal(e.target.value)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-body)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                            >
                                <option value="">None</option>
                                {goals.map(g => (
                                    <option key={g.id} value={g.id}>{g.title}</option>
                                ))}
                            </select>
                        ) : (
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--bg-body)',
                                    color: 'var(--text-main)',
                                    outline: 'none'
                                }}
                            >
                                <option value="">Select</option>
                                <option value="Housing">Housing</option>
                                <option value="Food">Food</option>
                                <option value="Transportation">Transportation</option>
                                <option value="Utilities">Utilities</option>
                                <option value="Insurance">Insurance</option>
                                <option value="Healthcare">Healthcare</option>
                                <option value="Savings">Savings</option>
                                <option value="Salary">Salary</option>
                                <option value="Investment">Investment</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                        )}
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ justifyContent: 'center', marginTop: '10px' }}
                >
                    <Plus size={20} />
                    Add Transaction
                </button>

            </form>
        </div>
    );
};

export default TransactionForm;
