// App.jsx
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import all your component views
import HomePage from './components/HomePage';
import AddLaptopForm from './components/AddLaptopForm';
import DistributeLaptopForm from './components/DistributeLaptopForm';
import ReturnLaptopForm from './components/ReturnLaptopForm';
import LaptopList from './components/LaptopList'; // Assuming this lists ALL laptops (distributed and not)
import DistributedLaptopsList from './components/DistributedLaptopsList'; // This lists ONLY distributed laptops
import LoginForm from './components/LoginForm';
import EditLaptopForm from './components/EditLaptopForm';
import RegisterForm from './components/RegisterForm';


// Import setAppView action from your laptopSlice
import { setAppView } from './features/laptops/laptopSlice';

function App() {
  // Select the current application view from the Redux store
  const appView = useSelector((state) => state.laptops.appView);
  // Select authentication status from the Redux auth slice
  const { isAuthenticated } = useSelector((state) => state.auth);
  // Get the dispatch function
  const dispatch = useDispatch();

  // Effect to handle initial authentication check and set view to login if not authenticated
  useEffect(() => {
    // If user is not authenticated and the current view is not already 'login',
    // dispatch setAppView to 'login' to force the login screen.
    if (!isAuthenticated && appView !== 'login') {
      dispatch(setAppView('login'));
    }
  }, [isAuthenticated, appView, dispatch]); // Dependencies ensure this effect runs when these values change

  let content; // Variable to hold the component to be rendered

  // Use a switch statement to conditionally render components based on the 'appView' state
  switch (appView) {
    case 'home':
      content = <HomePage />;
      break;
    case 'addLaptop': // View for adding a new laptop
      content = <AddLaptopForm />;
      break;
    case 'distributeLaptopForm': // View for the laptop distribution form (corrected view name)
      content = <DistributeLaptopForm />;
      break;
     case 'editLaptop': // This matches the 'editLaptop' string dispatched from LaptopList
      content = <EditLaptopForm />;
      break;
    case 'returnLaptop': // View for the laptop return form
      content = <ReturnLaptopForm />;
      break;
    case 'listLaptops': // View for listing all laptops
      content = <LaptopList />;
      break;
    case 'distributedLaptops': // View for listing only distributed laptops
      content = <DistributedLaptopsList />;
      break;
    case 'register': 
      content = <RegisterForm />;
      break;
  
    case 'login': // View for the login form
      content = <LoginForm />;
      break;
    default:
      // Default case if appView is not recognized, or for initial load before useEffect
      content = <HomePage />;
      break;
  }

  return (
    <div className="App">
      {/* Render the selected component */}
      {content}
      {/* ToastContainer for displaying notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;