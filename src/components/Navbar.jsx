import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, PieChart, Wallet, Moon, Sun } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    return (
        <nav className="navbar" style={{
            height: 'var(--header-height)',
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-color)',
            padding: '0 30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {/* Logo */}
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'var(--primary)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <Wallet size={24} />
                </div>
                <span style={{ fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Finova</span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    style={{
                        color: 'var(--text-muted)',
                        padding: '8px',
                        borderRadius: '50%',
                        transition: 'all 0.2s',
                        background: 'var(--bg-body)'
                    }}
                    title="Toggle Theme"
                >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                {/* Navigation */}
                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontWeight: '500', color: 'var(--text-main)' }}>{user.displayName || user.email}</span>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                background: '#E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}>
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <span style={{ fontWeight: '600', color: '#64748B' }}>{user.email?.[0].toUpperCase()}</span>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="btn"
                            style={{
                                color: 'var(--text-muted)',
                                padding: '8px',
                                borderRadius: '50%',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.color = 'var(--danger)'}
                            onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
