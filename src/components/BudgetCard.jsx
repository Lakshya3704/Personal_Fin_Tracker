import { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

const BudgetCard = ({ expenseTotal }) => {
    const [budget, setBudget] = useState(() => {
        return Number(localStorage.getItem('monthlyBudget')) || 20000;
    });
    const [isEditing, setIsEditing] = useState(false);
    const [newBudget, setNewBudget] = useState(budget);

    useEffect(() => {
        localStorage.setItem('monthlyBudget', budget);
    }, [budget]);

    const handleSave = () => {
        if (newBudget > 0) {
            setBudget(newBudget);
            setIsEditing(false);
        }
    };

    const percentage = Math.min((expenseTotal / budget) * 100, 100);
    const isOverBudget = expenseTotal > budget;

    return (
        <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex-between">
                <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Monthly Budget</h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                        <Pencil size={18} />
                    </button>
                ) : (
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={handleSave} style={{ color: 'var(--success)' }}><Check size={18} /></button>
                        <button onClick={() => setIsEditing(false)} style={{ color: 'var(--danger)' }}><X size={18} /></button>
                    </div>
                )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {isEditing ? (
                    <input
                        type="number"
                        value={newBudget}
                        onChange={(e) => setNewBudget(Number(e.target.value))}
                        autoFocus
                        style={{
                            fontSize: '24px',
                            fontWeight: '700',
                            padding: '8px',
                            borderRadius: '8px',
                            border: '1px solid var(--primary)',
                            width: '100%',
                            outline: 'none',
                            background: 'var(--bg-body)',
                            color: 'var(--text-main)'
                        }}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-main)' }}>
                            {expenseTotal.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                            / {budget.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                        </span>
                    </div>
                )}

                <div style={{ marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>
                        <span style={{ color: isOverBudget ? 'var(--danger)' : 'var(--primary)' }}>
                            {percentage.toFixed(1)}% Used
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>
                            {Math.max(budget - expenseTotal, 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })} Left
                        </span>
                    </div>

                    <div style={{ width: '100%', height: '12px', background: 'var(--bg-body)', borderRadius: '6px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: isOverBudget ? 'var(--danger)' : 'var(--primary)',
                            borderRadius: '6px',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetCard;
