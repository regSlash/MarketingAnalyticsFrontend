import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Auth/Login';
import AnalyticsChart from './components/Dashboard/AnalyticsChart';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<AnalyticsChart />} />
      </Routes>
    </Router>
  );
}

export default App;