// components/HomePage.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAppView, fetchLaptops } from '../features/laptops/laptopSlice';
import { logout } from '../features/auth/authSlice';
import { Laptop, Send, RotateCcw, List, LogOut, User as UserIcon, Home as HomeIcon, CheckCircle } from 'lucide-react'; // Import CheckCircle icon
import LoginForm from './LoginForm';
import { UserPlus } from 'lucide-react';

const HomePage = () => {
    const dispatch = useDispatch();
    const { items: laptops, status } = useSelector((state) => state.laptops);
    const { isAuthenticated, user, loading: authLoading, error: authError, successMessage: authSuccess } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && status === 'idle') {
            dispatch(fetchLaptops());
        }
    }, [isAuthenticated, status, dispatch]);

    const totalLaptops = laptops.length;
    const distributedLaptops = laptops.filter(laptop => laptop.distributedStatus).length;
    const availableLaptops = totalLaptops - distributedLaptops;

    const handleNavigate = (view) => {
        // If not authenticated, prompt login for protected actions
        if (!isAuthenticated && view !== 'home' && view !== 'login') { // Allow 'login' view
            dispatch(setAppView('login'));
            return;
        }
        dispatch(setAppView(view));
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(setAppView('login')); // Navigate to login after logout
    };

    if (!isAuthenticated) {
        return <LoginForm />;
    }

    return (
        <div
            className="relative w-full min-h-screen bg-cover bg-center flex flex-col items-center justify-center text-white p-4"
            style={{ backgroundImage: `url('/kigali_city_hall.jpeg')` }}
        >
            <div className="absolute inset-0 bg-black opacity-60"></div>

            {/* Top right user info and logout */}
            {isAuthenticated && user && (
                <div className="absolute z-50 top-4 right-4 flex items-center bg-gray-800 bg-opacity-50 text-white py-2 px-4 rounded-full text-sm">
                    <UserIcon className="w-4 h-4 mr-2" />
                    <span>Welcome, {user.username} ({user.role})</span>
                    <button
                        onClick={handleLogout}
                        className="ml-4 p-2 bg-red-600 hover:bg-red-700 rounded-full transition duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center"
                        title="Logout"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            )}

            {/* Top left Home button */}
            <div className="absolute z-50 top-4 left-4">
                <button
                    onClick={() => handleNavigate('home')}
                    className="p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg transition duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center"
                    title="Go to Home"
                >
                    <HomeIcon className="w-6 h-6 text-white" />
                </button>
            </div>

            <div className="relative z-90 text-center p-8 bg-black bg-opacity-40 rounded-lg shadow-2xl backdrop-blur-sm max-w-4xl w-full">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in-down">
                    CoK Equipment Management System
                </h1>
                <p className="text-lg md:text-xl mb-6 max-w-2xl mx-auto animate-fade-in-up">
                    Efficiently track, distribute, and manage City of Kigali's equipments assets.
                </p>

                {/* Current Inventory Snapshot */}
                <div className="bg-white bg-opacity-90 text-gray-800 p-4 rounded-lg shadow-lg max-w-sm mx-auto mb-6 animate-fade-in-up delay-500">
                    <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center justify-center">
                        <List className="w-5 h-5 mr-2" /> Current Inventory Snapshot
                    </h3>
                    <div className="space-y-2 text-left text-sm">
                        <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                            <span className="font-semibold">Total Equipments:</span>
                            <span className="text-xl font-bold text-blue-600">{totalLaptops}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1 border-b border-gray-200">
                            <span className="font-semibold">Distributed:</span>
                            <span className="text-xl font-bold text-red-600">{distributedLaptops}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Available:</span>
                            <span className="text-xl font-bold text-green-600">{availableLaptops}</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Data reflects latest fetch. Navigate to "View All Equipments" for details.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-lg mx-auto">
                    <button
                        onClick={() => handleNavigate('listLaptops')}
                        className="flex flex-col items-center justify-center p-3 sm:p-4 bg-blue-700 hover:bg-blue-800 transition duration-300 rounded-md shadow-md transform hover:scale-105 active:scale-95 animate-fade-in"
                    >
                        <List className="w-8 h-8 mb-2 text-white" />
                        <span className="text-sm sm:text-md font-semibold">View All</span>
                    </button>

                    {/* New button for Distributed Laptops */}
                    <button
                        onClick={() => handleNavigate('distributedLaptops')}
                        className="flex flex-col items-center justify-center p-3 sm:p-4 bg-teal-600 hover:bg-teal-700 transition duration-300 rounded-md shadow-md transform hover:scale-105 active:scale-95 animate-fade-in delay-50"
                    >
                        <CheckCircle className="w-8 h-8 mb-2 text-white" />
                        <span className="text-sm sm:text-md font-semibold">Distributed</span>
                    </button>
                     <button
              type="button"
              onClick={() => dispatch(setAppView("register"))}
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-blue-700 hover:bg-blue-800 transition duration-300 rounded-md shadow-md transform hover:scale-105 active:scale-95 animate-fade-in delay-50"
            >
              <UserPlus className="w-8 h-8 mr-2" /> Add User
            </button>
                    {/* End new button */}

                

                 

                  
                </div>
            </div>

            <footer className="relative top-3 z-90 w-full py-4 bg-gray-800 text-gray-200 text-center text-sm mt-8">
                © 2025 CoK Laptop Management System. All rights reserved.
            </footer>
        </div>
    );
};

export default HomePage;