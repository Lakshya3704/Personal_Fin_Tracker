import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Check your credentials.');
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="flex-center" style={{ minHeight: '100vh', background: 'var(--bg-body)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>

                <div className="flex-center" style={{ marginBottom: '30px', flexDirection: 'column', gap: '10px' }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        background: 'var(--primary)',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <Wallet size={28} />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Login to manage your finance</p>
                </div>

                {error && <div style={{ background: 'rgba(255, 91, 91, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '500' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                        style={{ justifyContent: 'center', marginTop: '10px' }}
                    >
                        {loading ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign Up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
