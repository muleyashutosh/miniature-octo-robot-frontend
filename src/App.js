import SignIn from './components/Signin/Signin';
import * as React from "react";
import { Routes, Route,  useLocation, Navigate} from "react-router-dom";
import useAuth from "./components/Signin/useAuth";

const Dashboard = () => <h1>Dashboard (Private)</h1>

function RequireAuth({ children }) {
  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? (
    children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}

function App() {
  return (
    <div>
      <SignIn />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
