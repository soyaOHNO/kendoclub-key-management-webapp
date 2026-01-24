import { BrowserRouter, Routes, Route } from "react-router-dom";
import TopPage from "./components/TopPage";
import BorrowKeyPage from "./components/BorrowKeyPage";
import ReturnKeyPage from "./components/ReturnKeyPage";
import HistoryPage from "./components/HistoryPage";
import AdminPage from "./components/AdminPage";
import AuthGuard from "./components/AuthGuard";
import "./styles/common.css";


function App() {
    return (
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<TopPage />} />
              <Route path="/lend" element={<BorrowKeyPage />} />
              <Route path="/return" element={<ReturnKeyPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/logs" element={<AuthGuard><HistoryPage /></AuthGuard>} />
          </Routes>
      </BrowserRouter>
    );
}

export default App;
