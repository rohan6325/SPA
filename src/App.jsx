import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import QuoteGenerator from './components/QuoteGenerator'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quote" element={<QuoteGenerator />} />
      </Routes>
    </Router>
  )
}

export default App
