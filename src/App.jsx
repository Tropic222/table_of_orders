import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import LoginForm from './components/LoginForm/LoginForm'
import OrdersPage from './components/OrdersPage/OrdersPage'

function App() {

  return (
    <Router>
      <Routes>
        <Route path='/' element={<LoginForm/>} />
        <Route path='/orders' element={<OrdersPage/>} />
      </Routes>
    </Router>
  )
}

export default App
