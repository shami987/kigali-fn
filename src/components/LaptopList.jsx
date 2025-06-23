import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLaptops,
  deleteLaptop,
  setAppView,
  clearMessages,
  setEditingLaptopId,
} from "../features/laptops/laptopSlice";
import {
  List,
  Home as HomeIcon,
  Search,
  Trash2,
  Edit2,
  Send,
  RotateCcw,
  PlusCircle, // Import PlusCircle icon
} from "lucide-react";

const LaptopList = () => {
  const dispatch = useDispatch();
  const {
    items: laptops,
    status,
    error,
    message,
  } = useSelector((state) => state.laptops);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAuthenticated && (status === "idle" || status === "failed")) {
      dispatch(fetchLaptops());
    }
  }, [dispatch, isAuthenticated, status]);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this laptop? This action cannot be undone."
      )
    ) {
      dispatch(clearMessages());
      try {
        await dispatch(deleteLaptop(id)).unwrap();
        alert("Equipment deleted successfully!");
      } catch (err) {
        console.error("Failed to delete equipment:", err);
      }
    }
  };

  const handleEdit = (laptopId) => {
    dispatch(setEditingLaptopId(laptopId));
    dispatch(setAppView("editLaptop"));
  };

  const handleBackToHome = () => {
    dispatch(setAppView("home"));
    dispatch(clearMessages());
  };

  const handleAddLaptop = () => {
    dispatch(setAppView("addLaptop"));
  };

  const filteredLaptops = laptops.filter((laptop) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const matchesName = laptop.name.toLowerCase().includes(lowerCaseSearchTerm);
    const matchesModel = laptop.model
      .toLowerCase()
      .includes(lowerCaseSearchTerm);
    const matchesSerialNumber = laptop.serialNumber
      .toLowerCase()
      .includes(lowerCaseSearchTerm);

    const matchesPrice = laptop.price?.toString().includes(lowerCaseSearchTerm);
    const matchesOrigin = laptop.origin
      ?.toLowerCase()
      .includes(lowerCaseSearchTerm);

    const matchesDateReceived = laptop.createdAt
      ? new Date(laptop.createdAt) // Corrected from createAt to createdAt
          .toLocaleDateString("en-GB")
          .includes(lowerCaseSearchTerm)
      : false;

    const matchesReason = laptop.returnedReason
      ? laptop.returnedReason.toLowerCase().includes(lowerCaseSearchTerm)
      : false;

    let matchesAssignedTo = false;
    if (laptop.assignedTo) {
      matchesAssignedTo =
        laptop.assignedTo.userName
          .toLowerCase()
          .includes(lowerCaseSearchTerm) ||
        laptop.assignedTo.userEmail
          .toLowerCase()
          .includes(lowerCaseSearchTerm) ||
        (laptop.assignedTo.userPhoneNumber &&
          laptop.assignedTo.userPhoneNumber
            .toLowerCase()
            .includes(lowerCaseSearchTerm)) ||
        (laptop.assignedTo.userPosition &&
          laptop.assignedTo.userPosition
            .toLowerCase()
            .includes(lowerCaseSearchTerm));
    }

    // Also include status in search
    const currentStatus = laptop.distributedStatus
      ? "distributed"
      : laptop.returnedReason
      ? "returned"
      : "available";
    const matchesStatus = currentStatus.includes(lowerCaseSearchTerm);

    return (
      matchesName ||
      matchesModel ||
      matchesSerialNumber ||
      matchesAssignedTo ||
      matchesReason ||
      matchesStatus ||
      matchesPrice ||
      matchesOrigin ||
      matchesDateReceived
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
          Loading laptops...
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Error Loading Laptops
          </h2>
          <p className="text-red-700 mb-6">
            {error || "An unknown error occurred while fetching laptops."}
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
            <List className="w-8 h-8 mr-2" /> All Equipments
          </h2>
          <div className="flex space-x-2">
            {" "}
            {/* Flex container for buttons */}
            <button
              onClick={handleAddLaptop}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition duration-200 flex items-center space-x-1"
              title="Add New Laptop"
            >
              <PlusCircle className="w-5 h-5" />
              <span className="hidden sm:inline">Add Device</span>
            </button>
            <button
              onClick={handleBackToHome}
              className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition duration-200 flex items-center space-x-1"
              title="Back to Home"
            >
              <HomeIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>
        </div>

        {/* Search Input Field */}
        <div className="mb-6 relative">
          <input
            type="text"
            placeholder="Search by name, model, serial number, assigned user, status, or return reason..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>

        {laptops.length === 0 ? (
          <p className="text-gray-600 text-center text-lg mt-8">
            No laptops found. Add new ones!
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
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                    Assigned To
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                    Price
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                    Origin
                  </th>
                  <th className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider">
                    Date Received
                  </th>{" "}
                  {/* New Column */}
                  <th className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLaptops.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-4 text-center text-gray-500">
                      No matching laptops found.
                    </td>{" "}
                    {/* Updated colspan */}
                  </tr>
                ) : (
                  filteredLaptops.map((laptop) => {
                    let statusText = "";
                    let statusClasses = "";

                    if (laptop.distributedStatus) {
                      statusText = "Distributed";
                      statusClasses = "bg-red-100 text-red-800";
                    } else if (laptop.returnedReason) {
                      // If not distributed but has a return reason
                      statusText = "Returned";
                      statusClasses = "bg-yellow-100 text-yellow-800"; // Or any color you prefer for returned
                    } else {
                      statusText = "Available";
                      statusClasses = "bg-green-100 text-green-800";
                    }

                    return (
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
                        <td className="py-3 px-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm ${statusClasses}`}
                          >
                            {statusText}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {laptop.assignedTo ? (
                            <div className="space-y-0.5">
                              <div className="font-semibold">
                                {laptop.assignedTo.userName}
                              </div>
                              <div className="text-xs text-gray-600">
                                {laptop.assignedTo.userEmail}
                              </div>
                              {laptop.assignedTo.userPhoneNumber && (
                                <div className="text-xs text-gray-600">
                                  Phone: {laptop.assignedTo.userPhoneNumber}
                                </div>
                              )}
                              {laptop.assignedTo.userPosition && (
                                <div className="text-xs text-gray-600">
                                  Position: {laptop.assignedTo.userPosition}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-500 italic">
                              Not Assigned
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {laptop.price ? (
                            `RWF ${laptop.price.toLocaleString()}`
                          ) : (
                            <span className="text-gray-500 italic">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {laptop.origin || (
                            <span className="text-gray-500 italic">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-700">
                          {laptop.createdAt ? (
                            new Date(laptop.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          ) : (
                            <span className="text-gray-500 italic">N/A</span>
                          )}
                        </td>
                        {/* New cell for Reason for Return */}
                        <td className="py-3 px-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(laptop._id)}
                              className="p-2 rounded-full text-blue-600 hover:bg-blue-100 hover:text-blue-900 transition-colors duration-200"
                              title="Edit Equipment"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(laptop._id)}
                              className="p-2 rounded-full text-red-600 hover:bg-red-100 hover:text-red-900 transition-colors duration-200"
                              title="Delete Equipment"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                            {/* Conditionally render Distribute/Return buttons based on status and return reason */}
                            {laptop.distributedStatus ? (
                              <button
                                onClick={() =>
                                  dispatch(setAppView("returnLaptop"))
                                }
                                className="p-2 rounded-full text-yellow-600 hover:bg-yellow-100 hover:text-yellow-900 transition-colors duration-200"
                                title="Return Laptop"
                              >
                                <RotateCcw className="w-5 h-5" />
                              </button>
                            ) : (
                              !laptop.returnedReason && ( // Only show distribute if not distributed and not returned
                                <button
                                  onClick={() =>
                                    dispatch(
                                      setAppView("distributeLaptopForm")
                                    )
                                  }
                                  className="p-2 rounded-full text-purple-600 hover:bg-purple-100 hover:text-purple-900 transition-colors duration-200"
                                  title="Distribute Equipment"
                                >
                                  <Send className="w-5 h-5" />
                                </button>
                              )
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaptopList;