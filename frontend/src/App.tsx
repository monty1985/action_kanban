import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppsPage from './components/AppsPage';
import ActionKanbanApp from './ActionKanbanApp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppsPage />} />
        <Route path="/action-kanban" element={<ActionKanbanApp />} />
      </Routes>
    </Router>
  );
}

export default App;