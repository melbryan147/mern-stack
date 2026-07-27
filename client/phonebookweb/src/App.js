import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
// import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/Auth/loginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UMSLayout from "./layouts/UMSLayout.jsx";
import PhoneBookLayout from "./layouts/PhoneBookLayout";
import PhoneBookNab from "./layouts/PhoneBookNab";
import HomePage from "./layouts/HomePage";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          <Route path="/" element={<PhoneBookNab />}>
            <Route index path="homepage" element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
           <Route path="/ums/*" element={<UMSLayout/>} />
           <Route path="/phonebook/*" element={<PhoneBookLayout/>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
