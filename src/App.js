import React, { useContext } from 'react'
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthContext } from './context/AuthContext';
function App() {

  const { currentUser } = useContext(AuthContext);
  console.log(currentUser);

  const ProtectedRoute = (({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children
  });

  // function ProtectedRoute(children) {
  //   if (!currentUser) {
  //     return <Navigate to="/login" />
  //   }
  // }

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={

          <ProtectedRoute children={<Home />}>
          </ProtectedRoute>

        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  )
}

export default App