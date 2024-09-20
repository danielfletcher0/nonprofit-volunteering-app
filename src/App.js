import "./App.css";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import UserRegistration from "./pages/UserRegistration";
import Login from "./pages/Login";
import NoPage from "./pages/NoPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="signup" element={<UserRegistration />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="*" element={<NoPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
