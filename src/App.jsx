import { useContext } from 'react';
import './App.css'
import AuthDetails from './components/validate';
import { AuthContext } from './components/context/AuthContext';
import Dashboard from './components/messages/dashboard';

function App() {
  const { currentUser } = useContext(AuthContext)
  console.log(currentUser)
  return (
    <>
      <div>
        <AuthDetails />
        <Dashboard></Dashboard>
      </div>
    </>
  )
}
export default App