import { createContext, useContext, useState } from "react";

// Create AuthContext
const AuthContext = createContext();

// Create AuthProvider
export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, setIsLoggedIn, username, setUsername }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};
