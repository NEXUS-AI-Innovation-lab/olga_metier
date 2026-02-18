// Importation du composant Button depuis la bibliothèque heroui/react
import { Button } from "@heroui/react"
// Importation de React pour utiliser JSX
import React from "react"

// Définition des propriétés attendues par le composant TaskCard
type Props = {
    task: any // Objet représentant la tâche à afficher
    actionLabel?: string // Libellé du bouton d'action (optionnel)
    onAction?: () => Promise<void> | void // Fonction à exécuter lors du clic sur le bouton d'action (optionnel)
    onClick?: () => void // Fonction à exécuter lors du clic sur la carte (optionnel)
}

// Composant fonctionnel TaskCard
export default function TaskCard({ task, actionLabel = "Open", onAction, onClick }: Props) {
    return (
        // Conteneur principal de la carte
        <div className="text-xs p-3 bg-white rounded-3xl w-full flex items-center gap-3 shadow-sm">
            {/* Zone de texte, cliquable si onClick est fourni */}
            <div className="flex-1" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
                {/* Affichage du code d'inventaire de la tâche */}
                <p className="font-semibold">{task.inventory_code}</p>
                {/* Affichage de l'identifiant du noeud courant ou "En attente" si non défini */}
                <p className="opacity-50 text-[13px]">{String(task.current_node_id ?? "En attente")}</p>
            </div>
            {/* Affichage du bouton d'action si onAction est fourni */}
            {onAction && <Button onPress={onAction} color="primary" size="sm" radius="full">{actionLabel}</Button>}
        </div>
    )
}