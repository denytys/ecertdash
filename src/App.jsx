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
    <Router basename="/dashboard/">
      <Routes>
        <Route path="/" element={<Home />}>
          <Route index element={<Navigate to="main" replace />} />
          <Route path="main" element={<Dashboard />} />
          <Route path="incoming" element={<IncomingCertificate />} />
          <Route path="outgoing" element={<OutgoingCertificate />} />
        </Route>
      </Routes>
    </Router>
  );
}
