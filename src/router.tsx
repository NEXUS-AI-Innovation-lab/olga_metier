import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import AuthProvider from "./features/auth/context/AuthProvider";


const router = createBrowserRouter([
    {
        path: "/",
        element: <AuthProvider>
            <Home />
        </AuthProvider>
    },
    {
        path: "/login",
        element: <AuthProvider>
            <Login />
        </AuthProvider>
    }
])

export default router