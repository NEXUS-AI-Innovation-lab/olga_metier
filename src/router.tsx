// --- Imports ---
import { createBrowserRouter } from "react-router";
import Home from "./pages/home";
import Login from "./pages/login";
import AuthProvider from "./features/auth/context/AuthProvider";
import Acteurs from "./pages/acteurs";
import Dash from "./pages/dash";

// --- Définition des routes de l'application ---
const router = createBrowserRouter([
    {
        path: "/",
        // Page d'accueil protégée par AuthProvider
        element: <AuthProvider>
            <Home />
        </AuthProvider>
    },
    {
        path: "/dash",
        // Tableau de bord protégé
        element: <AuthProvider><Dash /></AuthProvider>
    },
    {
        path: "/acteurs",
        // Page acteurs protégée
        element: <AuthProvider>
            <Acteurs />
        </AuthProvider>
    },
    {
        path: "/login",
        // Page de connexion protégée
        element: <AuthProvider>
            <Login />
        </AuthProvider>
    }
])

// --- Export du router ---
export default router