import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet
} from 'react-router-dom';
import AuthPage from './pages/auth/AuthPage';
import Dashboard from './pages/dashboard/Dashboard';
import { CreateBlog } from './pages/dashboard/CreateBlog';
import Preview from './pages/dashboard/Preview';
import Profile from './pages/user/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" />;
}
function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                <Route path="/" element={<Navigate to="/auth" />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/blog/:id" element={<Preview />} />
                    <Route
                        path="/dashboard/my-blogs"
                        element={<Dashboard selfBlog={true} />}
                    />
                    <Route
                        path="/dashboard/create-blog"
                        element={<CreateBlog />}
                    />
                    <Route
                        path="/dashboard/update-blog/:id"
                        element={<CreateBlog />}
                    />
                    <Route
                        path="/dashboard/profile"
                        element={<Profile />}
                    />
                </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
