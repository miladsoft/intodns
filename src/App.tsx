import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@/components/HomePage';
import DNSLookupPage from '@/components/DNSLookupPage';
import NotFoundPage from '@/components/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:domain" element={<DNSLookupPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;