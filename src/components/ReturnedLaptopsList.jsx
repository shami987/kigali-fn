// components/ReturnedLaptopsList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchReturnedLaptops,
  returnLaptop, // To mark a laptop as "available" from returned state
  setAppView,
  clearMessages,
  setErrorMessage,
} from "../features/laptops/laptopSlice";
import {
  List,
  Home as HomeIcon,
  RotateCcw, // For making available/re-distribute action
  Search,
  CheckCircle, // For "Make Available" or "Re-distribute"
} from "lucide-react";

const ReturnedLaptopsList = () => {
  const dispatch = useDispatch();
  const {
    returnedItems: laptops, // Use returnedItems from the state
    status,
    error,
    message,
  } = useSelector((state) => state.laptops);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthenticated && (status === "idle" || status === "failed" || (status === "succeeded" && laptops.length === 0))) {
        dispatch(fetchReturnedLaptops());
    }
    return () => {
      dispatch(clearMessages()); // Clear messages on unmount
    };
  }, [dispatch, isAuthenticated, status, laptops.length]);


  const handleMakeAvailable = async (laptopId) => {
    if (window.confirm("Are you sure you want to mark this laptop as available again?")) {
      dispatch(clearMessages());
      try {
        // Calling the returnLaptop thunk with null reason and false distributedStatus
        // This implies setting it back to 'available'
        await dispatch(returnLaptop({ laptopId, returnedReason: null, distributedStatus: false })).unwrap();
        // The returnLaptop fulfilled action in slice should handle updating the item
        // and removing it from `returnedItems` if it's no longer considered 'returned'.
        // Or, you might need a dedicated `makeLaptopAvailable` thunk if the logic is more complex.
      } catch (err) {
        console.error("Failed to make laptop available:", err);
        dispatch(setErrorMessage(err || "Failed to mark laptop as available."));
      }
    }
  };

  const handleBackToHome = () => {
    dispatch(setAppView("home"));
    dispatch(clearMessages());
  };

  const filteredLaptops = laptops.filter((laptop) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesName = laptop.name?.toLowerCase().includes(lowerCaseSearchTerm);
    const matchesModel = laptop.model?.toLowerCase().includes(lowerCaseSearchTerm);
    const matchesSerialNumber = laptop.serialNumber?.toLowerCase().includes(lowerCaseSearchTerm);

    const matchesPrice = laptop.price?.toString().includes(lowerCaseSearchTerm);
    const matchesOrigin = laptop.origin?.toLowerCase().includes(lowerCaseSearchTerm);

    const matchesDateReturned = laptop.returnedAt
      ? new Date(laptop.returnedAt).toLocaleDateString("en-GB").includes(lowerCaseSearchTerm)
      : false;

    const matchesReason = laptop.returnedReason
      ? laptop.returnedReason.toLowerCase().includes(lowerCaseSearchTerm)
      : false;

    return (
      matchesName ||
      matchesModel ||
      matchesSerialNumber ||
      matchesPrice ||
      matchesOrigin ||
      matchesDateReturned ||
      matchesReason
    );
  });

  if (status === "loading") {
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
          Loading returned laptops...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Returned Laptops
          </h2>
          <p className="text-red-700 mb-6">
            {error || "An unknown error occurred while fetching returned laptops."}
          </p>
          <button
            onClick={handleBackToHome}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-inter">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700 flex items-center">
            <RotateCcw className="w-8 h-8 mr-2" /> Returned Devices
          </h2>
          <button
            onClick={handleBackToHome}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition duration-200 flex items-center space-x-1"
            title="Back to Home"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        {/* Display success or error messages */}
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => dispatch(clearMessages())}>
              <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => dispatch(clearMessages())}>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        {/* Search Input Field */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search by name, model, serial number, reason, or date returned..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {laptops.length === 0 ? (
          <p className="text-gray-600 text-center text-lg mt-8">
            No returned laptops found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">
                    Name
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                    Model
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                    Serial No.
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                    Returned Reason
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                    Date Returned
                  </th>
                  <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLaptops.map((laptop) => (
                  <tr
                    key={laptop._id}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {laptop.name}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                      {laptop.model}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">
                      {laptop.serialNumber}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {laptop.returnedReason || (
                        <span className="text-gray-500 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {laptop.returnedAt ? (
                        new Date(laptop.returnedAt).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "short", year: "numeric" }
                        )
                      ) : (
                        <span className="text-gray-500 italic">N/A</span>
                      )}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        {/* Button to mark as available or re-distribute */}
                        <button
                          onClick={() => handleMakeAvailable(laptop._id)}
                          className="p-2 rounded-full text-green-600 hover:bg-green-100 hover:text-green-900 transition-colors duration-200"
                          title="Make Available / Re-distribute"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
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

export default ReturnedLaptopsList;