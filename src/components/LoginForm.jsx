import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearAuthMessages } from "../features/auth/authSlice";
import { setAppView } from "../features/laptops/laptopSlice"; // Import setAppView
import { LogIn, UserPlus } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  // Destructure isAuthenticated from auth state
  const { loading, error, successMessage, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Clear auth messages when the component unmounts
    return () => {
      dispatch(clearAuthMessages());
    };
  }, [dispatch]);

  // --- NEW useEffect for redirection after login ---
  useEffect(() => {
    // If authentication is successful, navigate to the 'home' view
    if (isAuthenticated) {
      dispatch(setAppView('home'));
    }
  }, [isAuthenticated, dispatch]); // Depend on isAuthenticated and dispatch

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const handleNavigateToRegister = () => {
    // This will set the appView to 'register', and App.jsx will render the RegisterForm
    dispatch(setAppView('register'));
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6 flex items-center justify-center">
          <LogIn className="w-8 h-8 mr-2" /> Admin Login
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your credentials to access the system.
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
            Logging in...
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
              htmlFor="email"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col items-center justify-center space-y-4 mt-6">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-300 transform hover:scale-105 w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

           
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;