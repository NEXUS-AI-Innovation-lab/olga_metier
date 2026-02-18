// Importation du composant Button depuis la bibliothèque heroui/react
import { Button } from "@heroui/react"
// Importation de React pour utiliser JSX
import React from "react"

// Définition des propriétés attendues par le composant InventoryCard
type Props = {
    inventory: { code: string; description?: string; canStart?: boolean } // Objet représentant l'inventaire à afficher
    onStart?: () => Promise<void> | void // Fonction à exécuter lors du clic sur le bouton Start (optionnel)
}

// Composant fonctionnel InventoryCard
export default function InventoryCard({ inventory, onStart }: Props) {
    return (
        // Conteneur principal de la carte d'inventaire
        <div className="text-xs p-3 bg-white rounded-3xl w-full flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
                {/* Zone d'information sur l'inventaire */}
                <div>
                    {/* Affichage du code de l'inventaire */}
                    <p className="font-semibold">{inventory.code}</p>
                    {/* Affichage de la description de l'inventaire */}
                    <p className="opacity-50 text-[13px]">{inventory.description}</p>
                </div>
                {/* Affichage du bouton Start si l'inventaire peut démarrer, sinon message No start */}
                {inventory.canStart ? (
                    <Button onPress={onStart} color="primary" size="sm" radius="full">Start</Button>
                ) : (
                    <span className="text-[12px] px-3 py-1 rounded-full bg-zinc-100 text-zinc-600">No start</span>
                )}
            </div>
        </div>
    )
}
