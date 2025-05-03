import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Book, Plus, LogOut, Menu, BookOpen, User } from 'lucide-react';

const NavLink = ({ to, icon: Icon, label, isRed, isActive, onClick }) => {
    const baseClasses =
        'flex items-center gap-2 font-bold transition-colors md:font-normal';

    const colorClasses = isRed
        ? `${baseClasses} hover:text-red-800 ${isActive ? 'text-red-800' : 'text-red-600'}`
        : `${baseClasses} hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-gray-700'}`;

    return (
        <li>
            {onClick ? (
                <button onClick={onClick} className={colorClasses}>
                    <Icon />
                    <span>{label}</span>
                </button>
            ) : (
                <Link to={to} className={colorClasses}>
                    <Icon />
                    <span>{label}</span>
                </Link>
            )}
        </li>
    );
};

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { currentUser, logout } = useAuth();
    
    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const navItems = [
        {
            to: '/dashboard/profile',
            icon: User,
            label: 'Profile',
            isActive: location.pathname === '/dashboard/profile',
            isRed: false
        },
        {
            to: '/dashboard/my-blogs',
            icon: Book,
            label: 'My Blogs',
            isActive: location.pathname === '/dashboard/my-blogs',
            isRed: false
        },
        {
            to: '/dashboard',
            icon: BookOpen,
            label: 'All Blogs',
            isActive: location.pathname === '/dashboard',
            isRed: false
        },
        {
            to: '/dashboard/create-blog',
            icon: Plus,
            label: 'Create Blog',
            isActive:
                location.pathname === '/dashboard/create-blog' ||
                location.pathname.includes('/dashboard/update-blog/'),
            isRed: false
        },
        {
            to: '#',
            icon: LogOut,
            label: 'Logout',
            isActive: false,
            isRed: true,
            onClick: handleLogout
        }
    ];

    return (
        <div className="bg-gray-50">
            <nav className="flex flex-col border-b bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between md:px-8 md:py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-800">
                            Dashboard
                        </span>
                        {currentUser && (
                            <span className="hidden text-sm text-gray-600 md:inline-block">
                                Welcome, {currentUser.name}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="text-gray-700 md:hidden"
                        aria-label="Toggle Menu"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <ul
                    className={`mt-4 flex-col gap-4 md:mt-0 md:flex md:flex-row md:items-center md:gap-6 ${
                        menuOpen ? 'flex' : 'hidden'
                    }`}
                >
                    {navItems.map((item, index) => (
                        <NavLink key={index} {...item} />
                    ))}
                </ul>
            </nav>
        </div>
    );
};
