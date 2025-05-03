import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './components/LoginForm/LoginForm'
import OrderDetailsPage from './components/OrderDetailsPage/OrderDetailsPage'
import OrderEditingPage from './components/OrderEditingPage/OrderEditingPage'
import OrdersPage from './components/OrdersPage/OrdersPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm/>} />
        <Route path='/orders' element={<OrdersPage/>} />
        <Route path='/orders/:num/view' element={<OrderDetailsPage />} />
        <Route path='/orders/:num/edit' element={<OrderEditingPage />} /> 
      </Routes>
    </Router>
  )
}

export default App