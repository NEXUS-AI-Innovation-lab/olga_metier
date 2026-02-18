// --- Imports ---
import { Button, Input } from "@heroui/react"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import useAuth from "../features/auth/hooks/useAuth"

// --- Constantes ---
// URL du backend récupérée depuis les variables d'environnement
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// --- Composant Login ---
export default () => {
    // --- Hooks et états ---
    const navigate = useNavigate() // Permet la navigation entre pages
    const auth = useAuth() // Récupère l'état d'authentification
    const [email, setEmail] = useState("") // Stocke l'email saisi
    const [error, setError] = useState("") // Stocke le message d'erreur

    // --- Effet de redirection si déjà connecté ---
    useEffect(() => {
        if (auth.login) navigate("/dash")
    }, [auth])

    // --- Fonction de gestion de la connexion ---
    const handleLogin = async () => {
        setError("")
        // Vérifie si l'email appartient à un groupe autorisé
        try {
            const res = await fetch(`${BACKEND_URL}/getAllInventoriesForUser?email=${encodeURIComponent(email)}`)
            const data = await res.json()
            if (res.ok && data && data.length > 0) {
                // Stocke l'email dans le localStorage et redirige
                localStorage.setItem("login", email)
                navigate("/dash")
            } else {
                setError("Email non reconnu ou non autorisé.")
            }
        } catch {
            setError("Erreur de connexion au serveur.")
        }
    }

    // --- Rendu du composant ---
    return (
        <div className="flex flex-col h-screen">
            {/* --- Barre de navigation --- */}
            <Navbar />
            <div className="flex-1 w-full flex items-center justify-center">
                <div className="w-120 flex gap-2 flex-col">
                    {/* --- Titre et instructions --- */}
                    <p className="text-2xl semiexpanded font-bold">Se connecter</p>
                    <p className="text-xs semiexpanded font-light pb-6">
                        Entrez votre email pour vous connecter.
                    </p>
                    {/* --- Champ de saisie de l'email --- */}
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        type="email"
                    />
                    {/* --- Affichage du message d'erreur --- */}
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    {/* --- Bouton de connexion --- */}
                    <Button
                        onPress={handleLogin}
                        color="primary"
                        className="semiexpanded"
                        radius="full"
                    >
                        Se connecter
                    </Button>
                </div>
            </div>
        </div>
    )
}