import { Navigate, Outlet, Route, Routes, useNavigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";

import ApplicationForm from "./components/ApplicationForm";
import ApplicationList from "./components/ApplicationList";
import ApplicationDetails from "./components/ApplicationDetails";
import AuthPage from "./components/AuthPage";

function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function Dashboard() {
    const { username, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="app">
            <header className="header dashboard-header">
                <div>
                    <h1>Job Application Tracker</h1>
                    <p>Track, manage and organize your job applications</p>
                </div>
                <div className="account-actions">
                    <span>Signed in as <strong>{username}</strong></span>
                    <button className="logout-button" onClick={handleLogout} type="button">
                        Log out
                    </button>
                </div>
            </header>

            <main className="container">
                <ApplicationForm />
                <ApplicationList />
            </main>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/application/:id" element={<ApplicationDetails />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;