import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import LoginPage from "./pages/Auth/loginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import UMSLayout from "./layouts/UMSLayout.jsx";
import PhoneBookLayout from "./layouts/PhoneBookLayout";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterPage />} />
          {/* <Route
            path="/ums/*"
            element={
              <ProtectedRoute>
                <UMSLayout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/phonebook/*"
            element={
              <ProtectedRoute>
                <PhoneBookLayout />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
