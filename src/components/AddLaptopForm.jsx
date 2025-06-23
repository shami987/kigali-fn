import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addLaptop, setAppView, clearMessages } from '../features/laptops/laptopSlice';
import { Laptop, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AddLaptopForm = () => {
    const [name, setName] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [model, setModel] = useState('');
    const [price, setPrice] = useState('');
    const [origin, setOrigin] = useState('');
    const dispatch = useDispatch();
    const { status } = useSelector((state) => state.laptops);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(clearMessages());

        // Show alert when trying to add a device
        alert('Attempting to add a new device...');

        try {
            await dispatch(addLaptop({ name, serialNumber, model, price, origin })).unwrap();
            setName('');
            setSerialNumber('');
            setModel('');
            setPrice('');
            setOrigin('');
            
            toast.success('Laptop added successfully!');
            dispatch(setAppView('listLaptops'));
        } catch (err) {
            toast.error(`Failed to add laptop: ${err.message || err}`);
            console.error('Failed to add laptop:', err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-blue-700 flex items-center">
                        <Laptop className="w-8 h-8 mr-2" /> Add New Device
                    </h2>
                    <button
                        onClick={() => {
                            dispatch(setAppView('listLaptops')); // Changed to listLaptops
                            dispatch(clearMessages()); // Clear any messages when navigating back
                        }}
                        className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600"
                        title="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-gray-600 mb-6">Fill in the details for the new device.</p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                            Device Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serialNumber">
                            Serial Number
                        </label>
                        <input
                            type="text"
                            id="serialNumber"
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            value={serialNumber}
                            onChange={(e) => setSerialNumber(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="model">
                            Model
                        </label>
                        <input
                            type="text"
                            id="model"
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
                            Price (RWF)
                        </label>
                        <input
                            type="number"
                            id="price"
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            required
                            min="0"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="origin">
                            Origin
                        </label>
                        <select
                            id="origin"
                            className="shadow appearance-none border rounded w-full py-2 px-3"
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            required
                        >
                            <option value="" disabled>Select origin</option>
                            <option value="donation">Donation</option>
                            <option value="purchased">Purchased</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            disabled={status === 'loading'}
                        >
                            {status === 'loading' ? 'Adding...' : 'Add Device'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddLaptopForm;