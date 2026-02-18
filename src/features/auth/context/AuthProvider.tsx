import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

/**
 * Définition du type du contexte d’authentification :
 * - login : représente le nom d’utilisateur connecté (ou null si non connecté)
 * - setLogin : fonction pour mettre à jour la valeur de login
 */
type AuthProps = {
  login: string | null;
  setLogin: (login: string | null) => void;
};

/**
 * Création du contexte d’authentification.
 * Par défaut, on initialise à null parce qu’au départ,
 * on ne connaît pas encore l’état d’authentification.
 */
export const authContext = createContext<AuthProps | null>(null);

/**
 * Composant provider d’authentification.
 * Il englobe les composants enfants et leur fournit l’état d’authentification.
 */
export default ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();                // Pour rediriger l’utilisateur si besoin
  const [login, setLogin] = useState<string | null>(null); // État du login utilisateur

  /**
   * useEffect de montage (s’exécute une seule fois au chargement du composant)
   * On vérifie s’il existe un login sauvegardé dans le localStorage.
   * Si oui → on met à jour l’état
   * Sinon → on redirige vers la page /login
   */
  useEffect(() => {
    const loginStr = localStorage.getItem("login");
    console.log("login", loginStr);

    if (loginStr) {
      setLogin(loginStr);
    } else {
      navigate("/login");
    }
  }, []);

  /**
   * useEffect de surveillance du login :
   * Chaque fois que "login" devient null, on redirige vers /login.
   * Cela permet d’éviter qu’un utilisateur non connecté reste sur une page protégée.
   */
  useEffect(() => {
    if (login === null) {
      navigate("/login", { replace: true });
    }
  }, [login]);

  /**
   * On retourne le Provider du contexte, qui permet aux composants enfants
   * d’accéder à la valeur "login" et à la fonction "setLogin".
   */
  return (
    <authContext.Provider value={{ login, setLogin }}>
      {children}
    </authContext.Provider>
  );
};
