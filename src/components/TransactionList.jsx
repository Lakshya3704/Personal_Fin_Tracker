import { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Trash2, Search, Filter } from 'lucide-react';

const TransactionList = ({ transactions }) => {
    const { deleteTransaction } = useFinance();
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const filteredTransactions = transactions.filter(t => {
        const matchesFilter = filter === 'all' || t.type === filter;
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(val);
    };

    const formatDate = (t) => {
        if (t.createdAt && t.createdAt.seconds) {
            return new Date(t.createdAt.seconds * 1000).toLocaleDateString();
        }
        if (t.date) {
            return new Date(t.date).toLocaleDateString();
        }
        return '';
    };

    return (
        <div className="card" style={{ flex: 1, minHeight: '400px' }}>
            <div className="flex-between" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '700' }}>Recent Transactions</h3>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                padding: '10px 10px 10px 40px',
                                borderRadius: '8px',
                                border: '1px solid var(--border-color)',
                                backgroundColor: 'var(--bg-body)',
                                color: 'var(--text-main)',
                                outline: 'none',
                                width: '200px'
                            }}
                        />
                    </div>

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{
                            padding: '10px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-body)',
                            color: 'var(--text-main)',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="all">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Title</th>
                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Category</th>
                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Date</th>
                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Amount</th>
                            <th style={{ padding: '12px', color: 'var(--text-muted)', fontWeight: '500' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-body)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '16px 12px', fontWeight: '500' }}>{t.title}</td>
                                <td style={{ padding: '16px 12px' }}>
                                    <span style={{
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        background: 'var(--bg-body)',
                                        color: 'var(--text-muted)'
                                    }}>
                                        {t.category}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 12px', color: 'var(--text-muted)' }}>{formatDate(t)}</td>
                                <td style={{
                                    padding: '16px 12px',
                                    fontWeight: '600',
                                    color: t.type === 'income' ? 'var(--success)' : 'var(--text-main)'
                                }}>
                                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                </td>
                                <td style={{ padding: '16px 12px' }}>
                                    <button
                                        onClick={() => deleteTransaction(t.id)}
                                        style={{ color: 'var(--text-muted)', transition: 'color 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                                        onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No transactions found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionList;
