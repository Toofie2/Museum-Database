import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import TicketPage from "./pages/TicketPage.jsx"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/tickets" element={<TicketPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App