import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import SignIn from './components/Signin/Signin';
import useAuth, { AuthProvider } from "./components/Signin/useAuth";

const Dashboard = () => <h1>Dashboard (Private)</h1>
const Pricing = () => <h1>Pricing (Private)</h1>

function RequireAuth({ children }) {
  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? (
    children
  ) : (
    <Navigate to="/" replace state={{ path: location.pathname }} />
  );
}

function App() {
  return (
    <div>
      <AuthProvider>
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
          <Route
            path="/pricing"
            element={
              <RequireAuth>
                <Pricing />
              </RequireAuth>
            }
          />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
