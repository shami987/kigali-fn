// Create a separate component for messages to keep App.js cleaner.


import React, { useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearMessages } from '../features/laptops/laptopSlice';

const MessageBox = ({ message, error }) => {
    const dispatch = useDispatch();

    // Clear messages after a few seconds
    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                dispatch(clearMessages());
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error, dispatch]);

    if (!message && !error) return null;

    const displayMessage = message || error;
    const type = message ? 'success' : 'error';
    const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
    const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
    const Icon = type === 'success' ? CheckCircle : XCircle;

    return (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${bgColor} ${textColor}`}>
            <Icon className="w-5 h-5" />
            <span>{displayMessage}</span>
        </div>
    );
};

export default MessageBox;