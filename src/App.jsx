import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'

import Dashboard from './pages/Dashboard'
import PatternLibrary from './pages/PatternLibrary'
import PatternEditor from './pages/PatternEditor'
import Measurements from './pages/Measurements'
import MyCollection from './pages/MyCollection'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/library" element={<PatternLibrary />} />
        <Route path="/editor/:id" element={<PatternEditor />} />
        <Route path="/measurements" element={<Measurements />} />
        <Route path="/collection" element={<MyCollection />} />
      </Routes>
    </>
  )
}

export default App
