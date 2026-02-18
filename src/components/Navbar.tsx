// Importation du composant Button depuis la bibliothèque heroui/react
import { Button } from "@heroui/react"
// Importation de useMemo pour mémoriser des valeurs
import { useMemo } from "react"
// Importation du hook useNavigate pour la navigation entre pages
import { useNavigate } from "react-router"
// Importation du hook d'authentification personnalisé
import useAuth from "../features/auth/hooks/useAuth"

// Composant Navbar affichant le titre et le bouton de connexion/déconnexion
export default () => {
    // Hook pour naviguer entre les pages
    const navigate = useNavigate()

    // Récupération de la fonction setLogin depuis le contexte d'authentification
    const {setLogin} = useAuth()

    // Mémorisation de l'email stocké dans le localStorage
    const email = useMemo(() => {
        return localStorage.getItem("login")
    }, [])

    // Rendu du composant Navbar
    return <div className="flex flex justify-between bg-neutral-50 px-50 py-3 ">
        {/* Titre de l'application */}
        <h1 className="text-xl kings font-bold tracking-wider">DOCTOLIB</h1>
        <div className="flex  items-center">
            {/* Affichage du bouton de déconnexion si l'utilisateur est connecté, sinon bouton de connexion */}
            {email ? <Button onPress={async () => {
                // Déconnexion : suppression du login, mise à jour du contexte, redirection vers la page de login
                localStorage.removeItem('login')
                setLogin(null)
                navigate("/login")
            }} size="sm" radius="full" className="font-semibold" color="warning">Deconnexion</Button> :
                <Button size="sm" radius="full" className="font-semibold" color="primary">Se connecter</Button>}
        </div>
    </div>
}