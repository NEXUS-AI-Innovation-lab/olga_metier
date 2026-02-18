import { useQuery } from "@tanstack/react-query";                     // Gestion des requêtes asynchrones (fetch + cache)
import Navbar from "../components/Navbar";                            // Barre de navigation
import { FaCalendar } from "react-icons/fa";                          // Icône de calendrier
import { RiArrowRightSLine } from "react-icons/ri";                   // Icône de flèche vers la droite
import { useState } from "react";                                     // Hook d’état React
import { FormSchema, type Form } from "../components/formInterpreter/types/type"; 
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";
import FormInterpreter from "../components/formInterpreter";           // Composant pour afficher dynamiquement un formulaire

// Récupération de l’URL du backend depuis les variables d’environnement
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Fonction utilitaire : vérifie si un objet donné contient les informations d’un rendez-vous médical
 */
const isRendezVous = (data: any) => {
  if (!data) return false;

  return (
    data["medical.first_name"] != null &&
    data["medical.last_name"] != null
  );
};

export default () => {
  // États locaux
  const [form, setForm] = useState<null | Form>();        // Contient la structure du formulaire affiché dans le modal
  const [taskID, setTaskId] = useState("");               // Identifiant de la tâche sélectionnée
  const [formData, setFormData] = useState<any>(null);    // Données saisies dans le formulaire

  console.log(formData);                                  // Debug : affiche les données courantes du formulaire

  /**
   * Récupération des tâches en cours avec React Query :
   * - queryKey : permet de mettre en cache cette requête sous une clef spécifique
   * - queryFn  : fonction asynchrone qui fetch les données du backend
   */
  const { data, refetch } = useQuery({
    queryKey: ["onGoingTasks"],
    queryFn: async () => {
      const res = await fetch(BACKEND_URL + "/ongoing?inventory_id=test");
      if (!res.ok) throw new Error();                   // En cas d’erreur HTTP
      const json = await res.json();
      return json;
    }
  });

  /**
   * Rendu du composant principal :
   * Contient :
   *  - une modale pour la confirmation d’un rendez-vous
   *  - une liste de rendez-vous existants
   */
  return (
    <div className="flex flex-col">
      
      {/* Modale d’affichage / modification du formulaire */}
      <Modal onClose={() => setForm(null)} className="bg-neutral-100" isOpen={form != null}>
        <ModalContent>
          {(onClose) => (
            <>
              {form != null && (
                <>
                  <ModalHeader className="flex flex-col gap-1">Confirmation de rendez-vous</ModalHeader>

                  <ModalBody>
                    {/* Affichage dynamique du formulaire à partir du schéma FormSchema */}
                    <FormInterpreter
                      data={formData}
                      setData={setFormData}
                      form={form}
                      isDisabled={false}
                    />
                  </ModalBody>

                  <ModalFooter>
                    {/* Bouton de fermeture */}
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>

                    {/* Bouton “Next” qui envoie les données du formulaire et passe à l’étape suivante */}
                    <Button
                      color="primary"
                      onPress={async () => {
                        await fetch(BACKEND_URL + "/next?task_id=" + taskID, {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify(formData)
                        });
                        refetch();  // Rafraîchit la liste des rendez-vous après modification
                        onClose();
                      }}
                    >
                      Next
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Barre de navigation */}
      <Navbar />

      {/* Liste des rendez-vous */}
      <div className="p-10 gap-4 flex flex-col">
        <p className="font-semibold semiexpanded pb-2">Liste des rendez-vous</p>

        {/* Affichage dynamique : on map sur la liste retournée par React Query */}
        {data && data.map((task: any, index: number) => {
          // Si ce n’est pas un rendez-vous médical, on passe
          if (!isRendezVous(task.data)) return null;

          const { current_node_id } = task;

          return (
            <div
              // Lorsqu’on clique sur un rendez-vous, on récupère son état et son formulaire associé
              onClick={async () => {
                try {
                  const res = await fetch(BACKEND_URL + "/status?task_id=" + task.id);
                  if (!res.ok) throw new Error();
                  const json = await res.json();
                  
                  // Validation du formulaire via le schéma zod
                  const form = FormSchema.parse(json.form);
                  
                  // Mise à jour des états locaux
                  setTaskId(task.id);
                  setForm(form);
                  if (json.data) setFormData(json.data);

                } catch {
                  // En cas d’échec du fetch, pas de plantage de l’app
                }
              }}
              key={index}
              className={`
                ${current_node_id == null
                  ? "opacity-80"
                  : "hover:scale-[1.01] hover:shadow-md"}
                w-full max-w-md
                p-4 rounded-2xl
                flex items-center justify-between
                bg-gradient-to-br from-zinc-50 to-zinc-100
                shadow-sm
                transition-all
                cursor-pointer
              `}
            >
              {/* Partie gauche : icône et infos du patient */}
              <div className="flex items-center gap-3">
                <div
                  className={`
                    ${current_node_id == null ? "bg-success" : "bg-zinc-600"}
                    flex items-center justify-center
                    w-10 h-10
                    rounded-full text-white
                  `}
                >
                  <FaCalendar size={16} />
                </div>

                <div className="flex flex-col">
                  {/* Titre : état du rendez-vous */}
                  <span className="text-sm font-semibold text-zinc-900">
                    {`${current_node_id == null
                      ? "Rendez-vous confirmé"
                      : "Rendez-vous en cours"}`}
                  </span>

                  {/* Sous-titre : nom et prénom du patient */}
                  <span className="text-xs text-zinc-700">
                    {task.data["medical.first_name"]} · {task.data["medical.last_name"]}
                  </span>
                </div>
              </div>

              {/* Flèche à droite si le rendez-vous est en cours */}
              {current_node_id == null ? <></> : <RiArrowRightSLine />}
            </div>
          );
        })}
      </div>
    </div>
  );
};
