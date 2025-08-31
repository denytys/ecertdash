import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import Dashboard from "./pages/Dashboard";
import IncomingCertificate from "./pages/IncomingCertificate";
import OutgoingCertificate from "./pages/OutgoingCertificate";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="incoming" element={<IncomingCertificate />} />
          <Route path="outgoing" element={<OutgoingCertificate />} />
        </Route>
      </Routes>
    </Router>
  );
}
