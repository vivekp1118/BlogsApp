import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';

const AuthPage = () => {
    const navigate = useNavigate();
    const { login, register, isAuthenticated, error } = useAuth();
    const [activeTab, setActiveTab] = useState('login');
    const [formData, setFormData] = useState({
        name: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (error) {
            toast.error(error, { position: 'top-center' });
        }
    }, [error]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            activeTab === 'signup' &&
            formData.password !== formData.confirmPassword
        ) {
            toast.error('Passwords do not match', { position: 'top-center' });
            return;
        }

        try {
            let result;

            if (activeTab === 'login') {
                result = await login(formData.email, formData.password);
            } else {
                result = await register(
                    formData.name,
                    formData.email,
                    formData.password,
                    formData.userName
                );
            }

            if (result.success) {
                toast.success(
                    `${activeTab === 'login' ? 'Logged in' : 'Registered'} successfully`
                );
                navigate('/dashboard');
            }
        } catch (err) {
            console.error('Auth error:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-orange-50">
            <section className="h-fit w-[340px] rounded-md border-2 bg-white p-6 shadow-lg md:w-[440px]">
                <header className="text-2xl font-bold">
                    {activeTab === 'login' ? 'Sign In' : 'Sign Up'}
                </header>
                <p className="mt-2 text-sm">
                    {activeTab === 'login'
                        ? 'Enter your credentials to access your account'
                        : 'Enter your details to create an account'}
                </p>
                <ul className="my-6 flex items-center justify-center gap-2 rounded-md bg-gray-200 p-1">
                    <li
                        className={`w-[50%] cursor-pointer list-none rounded-md p-1 text-center text-sm ${
                            activeTab === 'login' ? 'bg-white' : ''
                        }`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </li>
                    <li
                        className={`w-[50%] cursor-pointer list-none rounded-md p-1 text-center text-sm ${
                            activeTab === 'signup' ? 'bg-white' : ''
                        }`}
                        onClick={() => setActiveTab('signup')}
                    >
                        Sign Up
                    </li>
                </ul>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {activeTab === 'signup' && (
                        <>
                            <Input
                                label="Name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Username"
                                id="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                            />
                        </>
                    )}
                    <Input
                        label="Email"
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Password"
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    {activeTab === 'signup' && (
                        <Input
                            label="Confirm Password"
                            id="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <button
                        type="submit"
                        className="w-full rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </form>
                <Toaster />
            </section>
        </div>
    );
};

export default AuthPage;
