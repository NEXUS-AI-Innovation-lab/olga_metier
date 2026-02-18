import { useContext } from "react";
import { authContext } from "../context/AuthProvider";

/**
 * Hook personnalisé : useAuth
 * -------------------------------------------
 * Ce hook permet d'accéder facilement au contexte d'authentification
 * dans toute l'application, sans devoir importer directement `authContext`.
 * 
 * Exemple d'utilisation :
 * const { login, setLogin } = useAuth();
 */
export default () => {
  // On récupère la valeur du contexte à l'aide du hook React `useContext`
  const context = useContext(authContext);

  /**
   * Si le hook est utilisé en dehors du AuthProvider,
   * `useContext` retournera null. 
   * On lève une erreur explicite dans ce cas pour aider le développeur.
   */
  if (!context) throw new Error("useAuth must be inside an AuthProvider!");

  // Sinon, on retourne le contexte pour le rendre accessible
  return context;
};
