import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Plus, Trash2, Target } from 'lucide-react';

const GoalList = () => {
    const { goals, addGoal, updateGoal, deleteGoal } = useFinance();
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [targetAmount, setTargetAmount] = useState('');

    // Add Funds State
    const [addingTo, setAddingTo] = useState(null); // goal ID
    const [addAmount, setAddAmount] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        if (!title || !targetAmount) return;

        addGoal({
            title,
            targetAmount: Number(targetAmount)
        });
        setTitle('');
        setTargetAmount('');
        setShowForm(false);
    };

    const handleAddFunds = (goal) => {
        if (!addAmount) return;
        const newAmount = goal.currentAmount + Number(addAmount);
        updateGoal(goal.id, { currentAmount: newAmount });
        setAddAmount('');
        setAddingTo(null);
    };

    return (
        <div className="card" style={{ height: '100%', overflowY: 'auto' }}>
            <div className="flex-between" style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Financial Goals</h3>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn"
                    style={{ background: 'var(--bg-body)', color: 'var(--primary)', padding: '8px' }}
                >
                    <Plus size={20} />
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleCreate} style={{ marginBottom: '20px', padding: '15px', background: 'var(--bg-body)', borderRadius: '12px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Goal Name (e.g. Car)"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '8px' }}
                        />
                        <input
                            type="number"
                            placeholder="Target Amount"
                            value={targetAmount}
                            onChange={e => setTargetAmount(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Create Goal</button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {goals.map(goal => {
                    const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
                    return (
                        <div key={goal.id} style={{ padding: '15px', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
                            <div className="flex-between" style={{ marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ background: 'rgba(61, 210, 204, 0.15)', color: 'var(--success)', padding: '8px', borderRadius: '8px' }}>
                                        <Target size={18} />
                                    </div>
                                    <span style={{ fontWeight: '600' }}>{goal.title}</span>
                                </div>
                                <button onClick={() => deleteGoal(goal.id)} style={{ color: 'var(--text-muted)' }}><Trash2 size={16} /></button>
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <div className="flex-between" style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>
                                    <span>{Number(goal.currentAmount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                                    <span>{Number(goal.targetAmount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</span>
                                </div>
                                <div style={{ width: '100%', height: '8px', background: 'var(--bg-body)', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--success)', borderRadius: '4px' }} />
                                </div>
                            </div>

                            {addingTo === goal.id ? (
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <input
                                        type="number"
                                        placeholder="Amount"
                                        value={addAmount}
                                        onChange={e => setAddAmount(e.target.value)}
                                        style={{ width: '80px', padding: '5px', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                    />
                                    <button onClick={() => handleAddFunds(goal)} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '12px' }}>Save</button>
                                    <button onClick={() => setAddingTo(null)} className="btn" style={{ padding: '5px', background: 'transparent', border: '1px solid var(--border-color)' }}>X</button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAddingTo(goal.id)}
                                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px dashed var(--border-color)', background: 'transparent', color: 'var(--primary)', fontSize: '12px', cursor: 'pointer' }}
                                >
                                    + Add Funds
                                </button>
                            )}
                        </div>
                    );
                })}
                {goals.length === 0 && !showForm && (
                    <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '14px' }}>
                        No goals yet. Create one!
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoalList;
