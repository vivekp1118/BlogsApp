import React, { useState, useEffect } from 'react';
import { useAuth, axiosInstance } from '../../context/AuthContext';
import Input from '../../components/Input';
import toast, { Toaster } from 'react-hot-toast';
import { Navbar } from '../../components/Navbar';
import { Loader } from '../../components/Loader';

const Profile = () => {
    const { currentUser, updateProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        userName: '',
        email: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (currentUser) {
            setFormData({
                name: currentUser.name || '',
                userName: currentUser.userName || '',
                email: currentUser.email || ''
            });
        }
    }, [currentUser]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.userName.trim()) {
            newErrors.userName = 'Username is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setLoading(true);

        try {
            const result = await updateProfile(formData);

            if (result.success) {
                toast.success('Profile updated successfully');
            } else {
                toast.error('Failed to update profile');
            }
        } catch (error) {
            toast.error('An error occurred while updating profile');
            console.error('Profile update error:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) {
        return <Loader />;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="mx-auto max-w-3xl">
                    <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
                        <h1 className="mb-6 text-2xl font-bold text-gray-800">
                            User Profile
                        </h1>

                        <div className="mb-6 flex items-center">
                            <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white">
                                {currentUser.name &&
                                    currentUser.name[0].toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">
                                    {currentUser.name}
                                </h2>
                                <p className="text-gray-600">
                                    @{currentUser.userName}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Name"
                                id="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                error={errors.name}
                            />

                            <Input
                                label="Username"
                                id="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                error={errors.userName}
                            />

                            <Input
                                label="Email"
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                error={errors.email}
                                disabled
                            />

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="rounded-md bg-blue-500 px-6 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-blue-300"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-4 text-xl font-semibold text-gray-800">
                            Account Information
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between border-b pb-2">
                                <span className="text-gray-600">
                                    Member since
                                </span>
                                <span className="font-medium">
                                    {new Date(
                                        currentUser.createdAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">
                                    Last updated
                                </span>
                                <span className="font-medium">
                                    {new Date(
                                        currentUser.updatedAt
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <Toaster />
            </div>
        </>
    );
};

export default Profile;
