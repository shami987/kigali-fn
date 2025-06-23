import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateLaptop,
  setAppView,
  clearMessages,
  setEditingLaptopId,
  fetchLaptops,
} from '../features/laptops/laptopSlice';
import { Laptop, Save, X } from 'lucide-react'; // Changed ArrowLeftCircle to X
import { toast } from 'react-toastify';

const EditLaptopForm = () => {
  const dispatch = useDispatch();
  const {
    items: laptops,
    status: fetchStatus, // Renamed to fetchStatus to avoid conflict and clarify its purpose
    error,
    editingLaptopId,
  } = useSelector((state) => state.laptops);

  const laptopToEdit = laptops.find((laptop) => laptop._id === editingLaptopId);

  const [formData, setFormData] = useState({
    name: '',
    serialNumber: '',
    model: '',
    price: '',
    origin: '',
  });

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // New state to track saving status

  useEffect(() => {
    if (editingLaptopId && (fetchStatus === 'idle' || fetchStatus === 'failed')) {
      dispatch(fetchLaptops());
    }
  }, [dispatch, editingLaptopId, fetchStatus]);

  useEffect(() => {
    dispatch(clearMessages());

    if (laptopToEdit) {
      setFormData({
        name: laptopToEdit.name || '',
        serialNumber: laptopToEdit.serialNumber || '',
        model: laptopToEdit.model || '',
        price: laptopToEdit.price || '',
        origin: laptopToEdit.origin || '',
      });
    } else if (editingLaptopId && fetchStatus === 'succeeded') {
      toast.warn('Laptop not found for editing. Redirecting to list.');
      dispatch(setAppView('listLaptops'));
      dispatch(setEditingLaptopId(null));
    } else if (!editingLaptopId && fetchStatus !== 'loading') {
     
      dispatch(setAppView('listLaptops'));
      dispatch(setEditingLaptopId(null));
    }
  }, [laptopToEdit, editingLaptopId, fetchStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => { // Removed async here, it's just to show the modal
    e.preventDefault();
    dispatch(clearMessages());

    if (!editingLaptopId) {
      toast.error('Error: No laptop ID provided for update.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setShowConfirmModal(false); // Hide the modal immediately
    setIsSaving(true); // Set saving state to true

    try {
      await dispatch(
        updateLaptop({
          id: editingLaptopId,
          laptopData: formData,
        })
      ).unwrap();
      toast.success('Laptop updated successfully!');
      dispatch(setEditingLaptopId(null));
      dispatch(setAppView('listLaptops'));
    } catch (err) {
      toast.error(error || err.message || 'Failed to update laptop. Please try again.'); // Improved error message
      console.error('Failed to update laptop:', err);
    } finally {
      setIsSaving(false); // Always reset saving state
    }
  };

  const handleCancelSave = () => {
    setShowConfirmModal(false);
  };

  // Renamed to handleCloseForm for consistency with DistributeLaptopForm
  const handleCloseForm = () => {
    dispatch(setAppView('listLaptops'));
    dispatch(clearMessages());
    dispatch(setEditingLaptopId(null));
  };

  // --- Conditional Rendering for Loading/Not Found States ---
  if (fetchStatus === 'loading' && !laptopToEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-blue-600 flex items-center">
          <svg
            className="animate-spin h-6 w-6 mr-3 text-blue-600"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading laptop details...
        </p>
      </div>
    );
  }

  if (!laptopToEdit && editingLaptopId && fetchStatus === 'succeeded') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Laptop Not Found
          </h2>
          <p className="text-red-700 mb-6">
            The laptop you are trying to edit could not be found.
          </p>
          <button
            onClick={handleCloseForm} // Changed to handleCloseForm
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Go Back to List
          </button>
        </div>
      </div>
    );
  }

  if (!editingLaptopId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            No Laptop Selected
          </h2>
          <p className="text-red-700 mb-6">
            Please select a laptop from the list to edit.
          </p>
          <button
            onClick={handleCloseForm} // Changed to handleCloseForm
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Go Back to List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-inter">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm text-center">
            <h3 className="text-2xl font-bold text-blue-700 mb-4">Confirm Edit</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to save these changes?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirmSave}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
                disabled={isSaving} // Disable save button while saving
              >
                {isSaving ? 'Saving...' : 'Yes, Save'}
              </button>
              <button
                onClick={handleCancelSave}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md transition duration-300"
                disabled={isSaving} // Disable cancel button while saving
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700 flex items-center">
            <Laptop className="w-8 h-8 mr-2" /> Edit Equipment
          </h2>
          <button
            onClick={handleCloseForm} // Changed to handleCloseForm
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition duration-200"
            title="Close Form" // Updated title
          >
            <X className="w-6 h-6" /> {/* Changed icon to X */}
          </button>
        </div>
        <p className="text-gray-600 mb-6">Update the details for this equipment.</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Equipment Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={formData.name}
              onChange={handleChange}
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
              name="serialNumber"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={formData.serialNumber}
              onChange={handleChange}
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
              name="model"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Price (RWF)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="origin">
              Origin
            </label>
            <input
              type="text"
              id="origin"
              name="origin"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              value={formData.origin}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105 flex items-center"
              disabled={isSaving} // Use the new isSaving state here
            >
              <Save className="w-5 h-5 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLaptopForm;