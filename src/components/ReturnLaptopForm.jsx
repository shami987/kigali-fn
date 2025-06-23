// This component handles returning a laptop, now including the returnedReason field.

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { returnLaptop, fetchLaptops, setAppView, clearMessages } from '../features/laptops/laptopSlice';
import { RotateCcw, X } from 'lucide-react';
import { toast } from 'react-toastify'; // Import toast from react-toastify

const ReturnLaptopForm = () => {
    const dispatch = useDispatch();
    const { items: laptops, status, error, message } = useSelector((state) => state.laptops);

    const [selectedLaptopId, setSelectedLaptopId] = useState('');
    const [returnedReason, setReturnedReason] = useState('');

    useEffect(() => {
        // Fetch laptops when component mounts if not already fetched
        if (status === 'idle') {
            dispatch(fetchLaptops());
        }
        dispatch(clearMessages()); // Clear previous messages on component mount
    }, [dispatch, status]);

    // This useEffect will now handle displaying toast messages using react-toastify
    useEffect(() => {
        if (message) {
            toast.success(message);
            dispatch(clearMessages()); // Clear message after displaying
        }
        if (error) {
            toast.error(error);
            dispatch(clearMessages()); // Clear error after displaying
        }
    }, [message, error, dispatch]); // Depend on message, error, and dispatch

    const distributedLaptops = laptops.filter(laptop => laptop.distributedStatus);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // The useEffect will handle clearing messages after displaying toasts
        try {
            await dispatch(returnLaptop({
                laptopId: selectedLaptopId,
                returnedReason,
            })).unwrap();
            
            // Clear form fields only on successful return
            setSelectedLaptopId('');
            setReturnedReason('');
            
            // Navigate after a successful operation
            dispatch(setAppView('listLaptops')); 

        } catch (err) {
            console.error('Failed to return laptop:', err);
            // The error message from the Redux slice will be caught by the useEffect
            // and displayed as a toast.
        }
    };

    const handleBackToHome = () => {
         dispatch(setAppView('listLaptops'));
        dispatch(clearMessages()); // Clear any lingering messages when navigating away
    };

    if (status === 'loading' && laptops.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-yellow-600 flex items-center">
                    <svg className="animate-spin h-6 w-6 mr-3 text-yellow-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading distributed laptops...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-yellow-700 flex items-center">
                        <RotateCcw className="w-8 h-8 mr-2" /> Return Laptop
                    </h2>
                    <button
                        onClick={handleBackToHome}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition duration-200"
                        title="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">Select a distributed device to return and provide a reason.</p>

                {distributedLaptops.length === 0 && status !== 'loading' ? (
                    <p className="text-center text-lg text-gray-700">No distributed laptops to return.</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="laptopId">
                                Select device to Return
                            </label>
                            <select
                                id="laptopId"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-yellow-500 transition duration-200"
                                value={selectedLaptopId}
                                onChange={(e) => setSelectedLaptopId(e.target.value)}
                                required
                            >
                                <option value="">-- Select a distributed laptop --</option>
                                {distributedLaptops.map(laptop => (
                                    <option key={laptop._id} value={laptop._id}>
                                        {laptop.name} ({laptop.serialNumber}) - {laptop.assignedTo?.userName}
                                    </option>
                                ))}
                            </select>
                        </div>
                     
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Returning...' : 'Return Device'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ReturnLaptopForm;