import React from 'react';
import {BrowserRouter, Routes, Route} from "react-router-dom"
import HomePage from "./pages/HomePage.jsx"
import TicketPage from "./pages/TicketPage.jsx"
import ExhibitionsPage from './pages/ExhibitionsPage';
import ExhibitionViewPage from './pages/ExhibitionViewPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/tickets" element={<TicketPage />} />
        <Route path="/exhibitions" element={<ExhibitionsPage />} />
      <Route path="/exhibition/:id" element={<ExhibitionViewPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App