import './App.css';
import Form from '../src/Pages/Form'
import Admin from './Pages/Admin';
import { BrowserRouter as Router, Route,  Routes } from 'react-router-dom';
function App() {
  return (
    <><Router>
      <Routes>
        <Route path="/"  element={<Form/>} />
        <Route path="/Admin" element={<Admin/>} />
  
      </Routes>
  </Router></>
  );
}

export default App;
