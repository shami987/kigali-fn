import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthMessages } from "../features/auth/authSlice";
import { setAppView } from "../features/laptops/laptopSlice"; // Import setAppView
import { UserPlus, Home as HomeIcon } from "lucide-react";

const RegisterForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  useEffect(() => {
    // Clear any auth messages when component mounts or unmounts
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearAuthMessages()); // Clear previous messages
    try {
      await dispatch(register({ username, email, password, role })).unwrap();
      // Optionally clear form or navigate on success
      setUsername("");
      setEmail("");
      setPassword("");
      setRole("user");
      // After successful registration, navigate to home (which will show login if not authenticated)
      dispatch(setAppView("home"));
    } catch (err) {
      console.error("Failed to register:", err);
      // Error message will be displayed by MessageBox
    }
  };

  const handleBackToLogin = () => {
    dispatch(setAppView("home")); // Assuming 'home' shows login if not authenticated
    dispatch(clearAuthMessages());
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-center text-green-700 flex items-center">
            <UserPlus className="w-8 h-8 mr-2" /> Register New User
          </h2>
          <button
            onClick={handleBackToLogin}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition duration-200 flex items-center space-x-1"
            title="Back to Login/Home"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>
        <p className="text-center text-gray-600 mb-6">
          Create a new account to access the system.
        </p>

        {loading && (
          <div className="flex items-center justify-center mb-4 text-blue-500">
            <svg
              className="animate-spin h-5 w-5 mr-3 text-blue-500"
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
            Registering...
          </div>
        )}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}
        {successMessage && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline ml-2">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              placeholder="e.g., john.doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role"
            >
              Role
            </label>
            <select
              id="role"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="it_staff">IT Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
