import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FinanceProvider } from './context/FinanceContext';
import { ThemeProvider } from './context/ThemeContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" />;
    }
    return children;
};

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <FinanceProvider>
                    <Router>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/signup" element={<Signup />} />
                            <Route
                                path="/"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                        </Routes>
                    </Router>
                </FinanceProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
