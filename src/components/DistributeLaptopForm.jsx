import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { distributeLaptop, fetchLaptops, setAppView, clearMessages } from '../features/laptops/laptopSlice';
import { Send, X } from 'lucide-react';
import { toast } from 'react-toastify';

const DistributeLaptopForm = () => {
    const dispatch = useDispatch();
    const { items: laptops, status, error, message } = useSelector((state) => state.laptops);

    const [selectedLaptopId, setSelectedLaptopId] = useState('');
    const [userName, setUserName] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const [userPhoneNumber, setUserPhoneNumber] = useState('');
    const [userPosition, setUserPosition] = useState('');

    const [showConfirmModal, setShowConfirmModal] = useState(false); // New state for confirmation modal

    useEffect(() => {
        // Fetch laptops when component mounts if not already fetched
        if (status === 'idle' || status === 'failed') { // Fetch if idle or failed previously
            dispatch(fetchLaptops());
        }
        dispatch(clearMessages()); // Clear previous messages on component mount
    }, [dispatch, status]);

    const availableLaptops = laptops.filter(laptop => !laptop.distributedStatus);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if a laptop is selected
        if (!selectedLaptopId) {
            toast.error('Please select a laptop to distribute.');
            return;
        }

        // Show the confirmation modal instead of immediate dispatch
        setShowConfirmModal(true);
    };

    const handleConfirmDistribution = async () => {
        setShowConfirmModal(false); // Hide the modal immediately

        dispatch(clearMessages()); // Clear previous messages before starting new action
        try {
            await dispatch(distributeLaptop({
                laptopId: selectedLaptopId,
                userName,
                userEmail,
                userPhoneNumber,
                userPosition,
            })).unwrap(); // .unwrap() allows handling rejections with try/catch

            // Show success toast
            toast.success('Laptop successfully distributed!');

            // Clear form fields
            setSelectedLaptopId('');
            setUserName('');
            setUserEmail('');
            setUserPhoneNumber('');
            setUserPosition('');
            dispatch(setAppView('listLaptops')); // Navigate to laptop list after successful distribution
        } catch (err) {
            console.error('Failed to distribute equipment:', err);
            // Show error toast with a more user-friendly message
            toast.error(err.message || 'Failed to distribute laptop. Please try again.');
        }
    };

    const handleCancelDistribution = () => {
        setShowConfirmModal(false); // Simply hide the modal
    };

    const handleCloseForm = () => { // Renamed for clarity, this button closes the form
        dispatch(setAppView('listLaptops')); // Send back to the home view
        dispatch(clearMessages());
    };

    // Only show loading spinner if no laptops are loaded yet and status is loading
    if (status === 'loading' && laptops.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <p className="text-xl text-blue-600 flex items-center">
                    <svg className="animate-spin h-6 w-6 mr-3 text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading available laptops...
                </p>
            </div>
        );
    }

    // Get the name of the laptop selected for distribution for the modal
    const laptopNameForModal = selectedLaptopId
        ? (availableLaptops.find(laptop => laptop._id === selectedLaptopId)?.name || 'this device')
        : 'the selected device';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm text-center">
                        <h3 className="text-2xl font-bold text-purple-700 mb-4">Confirm Distribution</h3>
                        <p className="text-gray-700 mb-6">
                            Are you sure you want to distribute **{laptopNameForModal}** to **{userName}**?
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={handleConfirmDistribution}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                            >
                                Yes, Distribute
                            </button>
                            <button
                                onClick={handleCancelDistribution}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-purple-700 flex items-center">
                        <Send className="w-8 h-8 mr-2" /> Distribute Equipment
                    </h2>
                    <button
                        onClick={handleCloseForm} // This button closes the form and goes to home
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition duration-200"
                        title="Close Form"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">Select an equipment and assign it to a user.</p>

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

                {availableLaptops.length === 0 && status !== 'loading' ? (
                    <p className="text-center text-lg text-gray-700">No available laptops to distribute.</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="laptopId">
                                Select Laptop
                            </label>
                            <select
                                id="laptopId"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                value={selectedLaptopId}
                                onChange={(e) => setSelectedLaptopId(e.target.value)}
                                required
                            >
                                <option value="">-- Select an available equipment --</option>
                                {availableLaptops.map(laptop => (
                                    <option key={laptop._id} value={laptop._id}>
                                        {laptop.name} ({laptop.serialNumber}) - {laptop.model}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <hr className="my-6 border-gray-300" />
                        <h3 className="text-xl font-bold text-gray-700 mb-4">User Details</h3>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userName">
                                User Name
                            </label>
                            <input
                                type="text"
                                id="userName"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userEmail">
                                User Email
                            </label>
                            <input
                                type="email"
                                id="userEmail"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userPhoneNumber">
                                User Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                id="userPhoneNumber"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                value={userPhoneNumber}
                                onChange={(e) => setUserPhoneNumber(e.target.value)}
                                // Removed `required` for optional field
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userPosition">
                                User Position
                            </label>
                            <input
                                type="text"
                                id="userPosition"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
                                value={userPosition}
                                onChange={(e) => setUserPosition(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? 'Distributing...' : 'Distribute Equipment'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default DistributeLaptopForm;