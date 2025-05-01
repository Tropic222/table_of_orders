import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './components/LoginForm/LoginForm'
import OrderDetailsPage from './components/OrderDetailsPage/OrderDetailsPage'
import OrdersPage from './components/OrdersPage/OrdersPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm/>} />
        <Route path='/orders' element={<OrdersPage/>} />
        <Route path='/orders/:num/:type' element={<OrderDetailsPage />} /> 
      </Routes>
    </Router>
  )
}

export default App