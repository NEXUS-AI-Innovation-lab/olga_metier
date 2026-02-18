import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react"; 
import { useQuery } from "@tanstack/react-query";                         // Gestion du fetch + cache + états (loading, error, etc.) [web:8]
import { CiCircleCheck } from "react-icons/ci";
import { useMemo, useState } from "react";
import z from "zod";                                                      // Validation de schémas côté runtime [web:9]
import { FormSchema, type Form } from "../components/formInterpreter/types/type";
import FormInterpreter from "../components/formInterpreter";
import Navbar from "../components/Navbar";
import InventoryCard from "../components/InventoryCard";
import TaskCard from "../components/TaskCard";

// URL du backend récupérée depuis les variables d’environnement Vite
const API_URL = import.meta.env.VITE_BACKEND_URL;

// Schéma Zod pour valider la forme d’un "inventory" renvoyé par l’API
const inventorySchema = z.object({
  code: z.string(),
  description: z.string().optional(),
  canStart: z.boolean().optional()
});

export default () => {
  // État du formulaire courant (schéma de la tâche en cours)
  const [form, setForm] = useState<Form | null>(null);
  // Id de la tâche actuellement ouverte (dans la modale)
  const [taskId, setTaskId] = useState("");
  // Données saisies / chargées pour le formulaire
  const [formData, setFormData] = useState<any>({});
  // Groupes qui vont prendre le relais après la fin de la tâche
  const [nextGroups, setNextGroups] = useState<null | Array<string>>(null);
  // Indique si la tâche est terminée (pour afficher l’écran de validation)
  const [isTaskDone, setIsTaskDone] = useState<boolean>(false);

  // Email récupéré une seule fois depuis le localStorage (useMemo pour ne pas recalculer à chaque render)
  const email = useMemo(() => localStorage.getItem("login"), []);

  /**
   * Requête 1 : récupérer tous les inventaires disponibles pour l'utilisateur
   * - queryKey: identifiant du cache, dépend de l’email
   * - enabled: la requête ne se lance que si un email existe
   * - on parse la réponse avec zod pour garantir la forme des données [web:9]
   */
  const { data, isLoading: isInventoriesLoading } = useQuery({
    queryKey: ["getAllInventories", email],
    queryFn: async () => {
      const res = await fetch(
        API_URL + "/getAllInventoriesForUser?email=" + encodeURIComponent(String(email))
      );
      if (!res.ok) throw new Error();
      return z.array(inventorySchema).parse(await res.json());
    },
    enabled: !!email
  });

  /**
   * Requête 2 : récupérer les tâches déjà démarrées par l’utilisateur
   */
  const {
    data: startedTasks,
    isLoading: isStartedTasksLoading,
    refetch: refetchStartedTasks
  } = useQuery({
    queryKey: ["getStartedTasks", email],
    queryFn: async () => {
      const res = await fetch(
        API_URL + "/getStartedTasks?email=" + encodeURIComponent(String(email))
      );
      if (!res.ok) throw new Error();
      // Tableau d’objets génériques (clé string -> valeur any)
      return z.array(z.record(z.string(), z.any())).parse(await res.json());
    },
    enabled: !!email
  });

  /**
   * Requête 3 : récupérer les tâches "en cours" (takable) pour l’utilisateur
   */
  const {
    data: onGoingTasks,
    isLoading: isOnGoingTasksLoading,
    refetch
  } = useQuery({
    queryKey: ["getOnGoingTasks", email],
    queryFn: async () => {
      const res = await fetch(
        API_URL + "/ongoingUser?email=" + encodeURIComponent(String(email))
      );
      if (!res.ok) throw new Error();
      return z.array(z.record(z.string(), z.any())).parse(await res.json());
    },
    enabled: !!email
  });

  // Inventaires sur lesquels l’utilisateur peut démarrer une nouvelle tâche
  const launchable = data ? data.filter((i) => i.canStart) : [];

  // Tâches en cours (prises ou à prendre)
  const takable = onGoingTasks ?? [];

  // Tâches démarrées par l’utilisateur mais qui ne sont pas dans la liste takable
  const started = (startedTasks ?? []).filter(
    (s: any) => !takable.find((t: any) => t.id === s.id)
  );

  return (
    <div className="flex h-screen w-screen bg-neutral-100 flex-col">
      {/* Barre de navigation principale */}
      <Navbar />

      <div className="p-6 flex flex-col gap-6">
        {/* En-tête : titre + email + compteurs */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold semiexpanded">Tasks</h1>
            <p className="text-sm text-zinc-600 mt-1">{email ?? "Invité"}</p>
          </div>

          {/* Badges de statistiques : nombre de launchable / takable / started */}
          <div className="flex gap-3">
            <div className="px-3 py-1 bg-white rounded-full shadow-sm text-xs">
              Launchable: <span className="font-semibold">{launchable.length}</span>
            </div>
            <div className="px-3 py-1 bg-white rounded-full shadow-sm text-xs">
              Takable: <span className="font-semibold">{takable.length}</span>
            </div>
            <div className="px-3 py-1 bg-white rounded-full shadow-sm text-xs">
              Started: <span className="font-semibold">{started.length}</span>
            </div>
          </div>
        </div>

        {/* Grille en 3 colonnes : launchable / takable / started */}
        <div className="grid grid-cols-3 gap-6">
          {/* Colonne Launchable */}
          <section className="col-span-1">
            <h3 className="text-sm font-medium mb-2">Lancer une demande</h3>
            <p className="text-xs text-zinc-500 mb-3">
              Inventaires où vous pouvez démarrer une tâche
            </p>
            <div className="flex flex-col gap-3">
              {!isInventoriesLoading && launchable.length > 0 ? (
                launchable.map((inv) => (
                  <InventoryCard
                    key={inv.code}
                    inventory={inv}
                    onStart={async () => {
                      // Démarrage d’une nouvelle tâche pour cet inventaire
                      const res = await fetch(
                        API_URL + "/startTask?inventory_id=" + inv.code + "&email=" + email
                      );
                      try {
                        if (!res.ok) throw new Error();
                        const json = await res.json();
                        // On récupère le schéma du formulaire de la tâche
                        setForm(FormSchema.parse(json.form));
                        setTaskId(json.task_id);
                      } catch {}
                    }}
                  />
                ))
              ) : (
                !isInventoriesLoading && (
                  <div className="text-xs p-4 bg-white rounded-3xl text-zinc-500 text-center">
                    Aucune tâche à lancer
                  </div>
                )
              )}
            </div>
          </section>

          {/* Colonne Takable */}
          <section className="col-span-1">
            <h3 className="text-sm font-medium mb-2">Demande à prendre</h3>
            <p className="text-xs text-zinc-500 mb-3">Demande disponibles</p>
            <div className="flex flex-col gap-3">
              {!isOnGoingTasksLoading && takable.length > 0 ? (
                takable.map((t: any) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    actionLabel="Poursuivre"
                    onAction={async () => {
                      // Récupère l’état actuel de la tâche et son formulaire
                      const res = await fetch(API_URL + "/status?task_id=" + t.id);
                      try {
                        if (!res.ok) throw new Error();
                        const json = await res.json();
                        setForm(FormSchema.parse(json.form));
                        setFormData(json.data);
                        setTaskId(t.id);
                      } catch {}
                    }}
                  />
                ))
              ) : (
                !isOnGoingTasksLoading && (
                  <div className="text-xs p-4 bg-white rounded-3xl text-zinc-500 text-center">
                    Aucune demande à prendre
                  </div>
                )
              )}
            </div>
          </section>

          {/* Colonne Started */}
          <section className="col-span-1">
            <h3 className="text-sm font-medium mb-2">Demandes démarrées</h3>
            <p className="text-xs text-zinc-500 mb-3">
              Vos demandes en cours ou en pause
            </p>
            <div className="flex flex-col gap-3">
              {started && started.length > 0 ? (
                started.map((t: any) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    onClick={async () => {
                      // Recharger l’état et le formulaire de cette tâche démarrée
                      try {
                        const res = await fetch(API_URL + "/status?task_id=" + t.id);
                        if (!res.ok) throw new Error();
                        const json = await res.json();
                        setForm(FormSchema.parse(json.form));
                        setFormData(json.data);
                        setTaskId(t.id);
                      } catch {}
                    }}
                    actionLabel="Voir"
                  />
                ))
              ) : (
                <div className="text-xs p-4 bg-white rounded-3xl text-zinc-500 text-center">
                  Aucune tâche démarrée
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Modale d’exécution d’une tâche (formulaire dynamique + écran de validation) */}
        <Modal
          className="bg-neutral-100"
          onClose={() => setForm(null)}
          isOpen={form != null || isTaskDone}
        >
          <ModalContent>
            <ModalHeader>Exécution de la tâche</ModalHeader>
            <ModalBody>
              {/* Écran de fin : tâche validée */}
              {isTaskDone && (
                <div className="flex flex-col items-center">
                  <p className="semiexpanded font-semibold text-lg mb-1">
                    Tâche validée
                  </p>
                  <CiCircleCheck className="!text-success" size={40} />
                  {nextGroups && (
                    <p className="text-sm mt-4">
                      Les groupes suivants prendront le relais :{" "}
                      <span className="font-semibold">
                        {nextGroups.join(", ")}
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Affichage du formulaire si la tâche n’est pas terminée */}
              {form != null && (
                <FormInterpreter
                  data={formData}
                  setData={setFormData}
                  form={form}
                  isDisabled={false}
                />
              )}
            </ModalBody>
            <ModalFooter>
              {/* Bouton principal : "Next" pendant la tâche, "OK" quand la tâche est terminée */}
              <Button
                onPress={async () => {
                  // Si la tâche est déjà marquée comme terminée, on réinitialise juste l’état de la modale
                  if (isTaskDone) {
                    setIsTaskDone(false);
                    setNextGroups(null);
                    return;
                  }
                  try {
                    // Envoi des données du formulaire au backend pour avancer dans le workflow
                    const res = await fetch(
                      API_URL + "/next?task_id=" + taskId + "&email=" + email,
                      {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify(formData)
                      }
                    );
                    const json = await res.json();

                    // Si le backend renvoie encore un form, la tâche continue (nouvelle étape)
                    if (json.form) {
                      setForm(FormSchema.parse(json.form));
                    } else {
                      // Sinon, la tâche est finie
                      setForm(null);
                      setIsTaskDone(true);
                      if (json.next_groups && Array.isArray(json.next_groups)) {
                        setNextGroups(json.next_groups);
                      }
                    }

                    // Rafraîchit les listes (takable + started)
                    refetch();
                    refetchStartedTasks();
                  } catch {}
                }}
                color="primary"
              >
                {isTaskDone ? "OK" : "Next"}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
};
