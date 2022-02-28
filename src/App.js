import { Routes, Route, useNavigate } from "react-router-dom";
import Layout from "./components/Layout";
import Missing from './components/Missing'
import SignIn from './components/Signin/Signin';
import RequireAuth from './components/RequireAuth'
import Transactions from './components/Transactions'
import useAuth from './hooks/useAuth'
import axios from "./api/axios";



const Dashboard = () => {
  const {auth, setAuth} = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => { 
    
    try {
      const response = await axios.get('/auth/logout', {
        withCredentials: true
      })
      console.log(response?.status)

      setAuth(prev => {
        console.log(prev)
        return {}
      })
      console.log(auth);
      navigate("/", { replace: true });
    } catch(err) {
      console.log(err);
    }
  }

  return (
    <section>
      <div>
      <h1>Dashboard(Private)</h1>
      <button onClick={handleLogout}>Logout</button>
      </div>
      <Transactions />
    </section>
  )
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<SignIn />}/>
        
        {/* protected routes */}
        <Route element = {<RequireAuth/>} >
          <Route
            path="/dashboard"
            element={
              <Dashboard />
            }
          />
        </Route>
        <Route
          path="*"
          element={<Missing />}
        />
        
      </Route>
    </Routes>
  );
}

export default App;
