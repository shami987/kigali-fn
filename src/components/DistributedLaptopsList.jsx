// components/DistributedLaptopsList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLaptops, setAppView, clearMessages } from '../features/laptops/laptopSlice';
import { List, X, PlusCircle } from 'lucide-react'; // Import PlusCircle icon
import { format } from 'date-fns';

const DistributedLaptopsList = () => {
    const dispatch = useDispatch();
    const { items: laptops, status, error, message } = useSelector((state) => state.laptops);

    useEffect(() => {
        // Fetch laptops when component mounts if not already fetched or if status is not 'succeeded'
        if (status === 'idle' || status === 'failed') {
            dispatch(fetchLaptops());
        }
        dispatch(clearMessages()); // Clear previous messages on component mount
    }, [dispatch, status]);

    const distributedLaptops = laptops.filter(laptop => laptop.distributedStatus);

    const handleBackToHome = () => {
        dispatch(setAppView('home'));
        dispatch(clearMessages());
    };

    // NEW: Handler for navigating to the distribution form
    const handleGoToDistributeForm = () => {
        dispatch(setAppView('distributeLaptopForm')); // Assuming 'distributeLaptopForm' is the view for your form
        dispatch(clearMessages());
    };

    if (status === 'loading' && laptops.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-blue-600 flex items-center">
                    <svg className="animate-spin h-6 w-6 mr-3 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading distributed equipments...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-blue-700 flex items-center">
                        <List className="w-8 h-8 mr-2" /> Distributed Equipments
                    </h2>
                    <div className="flex space-x-2"> {/* Container for multiple buttons */}
                        {/* NEW: Button to go to Distribute Laptop Form */}
                        <button
                            onClick={handleGoToDistributeForm}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition duration-200 flex items-center justify-center shadow-md"
                            title="Distribute New Laptop"
                        >
                            <PlusCircle className="w-6 h-6 mr-1" /> {/* Icon for Plus Circle */}
                            Distribute
                        </button>
                        <button
                            onClick={handleBackToHome}
                            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition duration-200"
                            title="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                <p className="text-gray-600 mb-6">Here is a list of all distributed equipments and their assigned users.</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Error!</strong>
                        <span className="block sm:inline ml-2">{error}</span>
                    </div>
                )}
                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Success!</strong>
                        <span className="block sm:inline ml-2">{message}</span>
                    </div>
                )}

                {distributedLaptops.length === 0 && status !== 'loading' ? (
                    <p className="text-center text-lg text-gray-700">No laptops have been distributed yet.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow overflow-hidden">
                            <thead className="bg-gray-200 text-gray-700 uppercase text-sm leading-normal">
                                <tr>
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Serial No.</th>
                                    <th className="py-3 px-6 text-left">Model</th>
                                    <th className="py-3 px-6 text-left">Assigned To</th>
                                    <th className="py-3 px-6 text-left">User Email</th>
                                    <th className="py-3 px-6 text-left">User Position</th>
                                    
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {distributedLaptops.map((laptop) => (
                                    <tr key={laptop._id} className="border-b border-gray-200 hover:bg-gray-100">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">{laptop.name}</td>
                                        <td className="py-3 px-6 text-left">{laptop.serialNumber}</td>
                                        <td className="py-3 px-6 text-left">{laptop.model}</td>
                                        <td className="py-3 px-6 text-left">{laptop.assignedTo.userName}</td>
                                        <td className="py-3 px-6 text-left">{laptop.assignedTo.userEmail}</td>
                                        <td className="py-3 px-6 text-left">{laptop.assignedTo.userPosition}</td>
                                       
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistributedLaptopsList;