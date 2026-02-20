import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { CiCircleCheck } from "react-icons/ci";
import { useMemo, useState } from "react";
import z from "zod";
import {
  FormSchema,
  type Form,
} from "../components/formInterpreter/types/type";
import FormInterpreter from "../components/formInterpreter";
import Navbar from "../components/Navbar";
import InventoryCard from "../components/InventoryCard";
import TaskCard from "../components/TaskCard";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const inventorySchema = z.object({
  code: z.string(),
  description: z.string().optional(),
  canStart: z.boolean().optional(),
});

export default () => {
  const [form, setForm] = useState<Form | null>(null);
  const [taskId, setTaskId] = useState("");
  const [formData, setFormData] = useState<any>({});
  const [nextGroups, setNextGroups] = useState<null | Array<string>>(null);
  const [isTaskDone, setIsTaskDone] = useState<boolean>(false);

  const email = useMemo(() => localStorage.getItem("login"), []);

  const { data, isLoading: isInventoriesLoading } = useQuery({
    queryKey: ["getAllInventories", email],
    queryFn: async () => {
      const res = await fetch(
        API_URL +
          "/getAllInventoriesForUser?email=" +
          encodeURIComponent(String(email)),
      );
      if (!res.ok) throw new Error();
      return z.array(inventorySchema).parse(await res.json());
    },
    enabled: !!email,
  });

  const {
    data: startedTasks,
    isLoading: isStartedTasksLoading,
    refetch: refetchStartedTasks,
  } = useQuery({
    queryKey: ["getStartedTasks", email],
    queryFn: async () => {
      const res = await fetch(
        API_URL + "/getStartedTasks?email=" + encodeURIComponent(String(email)),
      );
      if (!res.ok) throw new Error();
      return z.array(z.record(z.string(), z.any())).parse(await res.json());
    },
    enabled: !!email,
  });

  const {
    data: onGoingTasks,
    isLoading: isOnGoingTasksLoading,
    refetch,
  } = useQuery({
    queryKey: ["getOnGoingTasks", email],
    queryFn: async () => {
      const res = await fetch(
        API_URL + "/ongoingUser?email=" + encodeURIComponent(String(email)),
      );
      if (!res.ok) throw new Error();
      return z.array(z.record(z.string(), z.any())).parse(await res.json());
    },
    enabled: !!email,
  });

  const launchable = data ? data.filter((i) => i.canStart) : [];
  const takable = onGoingTasks ?? [];
  const started = (startedTasks ?? []).filter(
    (s: any) => !takable.find((t: any) => t.id === s.id),
  );

  return (
    <div className="flex h-screen w-screen bg-neutral-100 flex-col">
      <Navbar />

      <div className="p-6 flex flex-col gap-6 flex-1 overflow-hidden">
        {/* HEADER GLOBAL */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold semiexpanded">Tasks</h1>
            <p className="text-sm text-zinc-600 mt-1">{email ?? "Invité"}</p>
          </div>

          <div className="flex gap-3">
            <div className="px-3 py-1 bg-white rounded-full shadow-sm text-xs">
              Launchable:{" "}
              <span className="font-semibold">{launchable.length}</span>
            </div>
            <div className="px-3 py-1 bg-white rounded-full shadow-sm text-xs">
              Takable: <span className="font-semibold">{takable.length}</span>
            </div>
            <div className="px-3 py-1 bg-white rounded-full shadow-sm text-xs">
              Started: <span className="font-semibold">{started.length}</span>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* ---------------- LAUNCHABLE ---------------- */}
          <section className="flex flex-col overflow-hidden">
            <div className="mb-3">
              <h3 className="text-sm font-medium">Lancer une demande</h3>
              <p className="text-xs text-zinc-500">
                Inventaires où vous pouvez démarrer une tâche
              </p>
            </div>

            <ScrollShadow
              hideScrollBar
              size={60}
              className="flex flex-col gap-3 flex-1 pr-2"
            >
              {!isInventoriesLoading && launchable.length > 0
                ? launchable.map((inv) => (
                    <InventoryCard
                      key={inv.code}
                      inventory={inv}
                      onStart={async () => {
                        const res = await fetch(
                          API_URL +
                            "/startTask?inventory_id=" +
                            inv.code +
                            "&email=" +
                            email,
                        );
                        if (!res.ok) return;
                        const json = await res.json();
                        setForm(FormSchema.parse(json.form));
                        setTaskId(json.task_id);
                      }}
                    />
                  ))
                : !isInventoriesLoading && (
                    <div className="text-xs p-4 bg-white rounded-3xl text-zinc-500 text-center">
                      Aucune tâche à lancer
                    </div>
                  )}
            </ScrollShadow>
          </section>

          {/* ---------------- TAKABLE ---------------- */}
          <section className="flex flex-col overflow-hidden">
            <div className="mb-3">
              <h3 className="text-sm font-medium">Demande à prendre</h3>
              <p className="text-xs text-zinc-500">Demandes disponibles</p>
            </div>

            <ScrollShadow
              hideScrollBar
              size={60}
              className="flex flex-col gap-3 flex-1 pr-2"
            >
              {!isOnGoingTasksLoading && takable.length > 0
                ? takable.map((t: any) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      actionLabel="Poursuivre"
                      onAction={async () => {
                        const res = await fetch(
                          API_URL + "/status?task_id=" + t.id,
                        );
                        if (!res.ok) return;
                        const json = await res.json();
                        setForm(FormSchema.parse(json.form));
                        setFormData(json.data);
                        setTaskId(t.id);
                      }}
                    />
                  ))
                : !isOnGoingTasksLoading && (
                    <div className="text-xs p-4 bg-white rounded-3xl text-zinc-500 text-center">
                      Aucune demande à prendre
                    </div>
                  )}
            </ScrollShadow>
          </section>

          {/* ---------------- STARTED ---------------- */}
          <section className="flex flex-col overflow-hidden">
            <div className="mb-3">
              <h3 className="text-sm font-medium">Demandes démarrées</h3>
              <p className="text-xs text-zinc-500">
                Vos demandes en cours ou en pause
              </p>
            </div>

            <ScrollShadow
              hideScrollBar
              size={60}
              className="flex flex-col gap-3 flex-1 pr-2"
            >
              {started.length > 0 ? (
                started.map((t: any) => (
                  <TaskCard
                    key={t.id}
                    task={t}
                    actionLabel="Voir"
                    onClick={async () => {
                      const res = await fetch(
                        API_URL + "/status?task_id=" + t.id,
                      );
                      if (!res.ok) return;
                      const json = await res.json();
                      setForm(FormSchema.parse(json.form));
                      setFormData(json.data);
                      setTaskId(t.id);
                    }}
                  />
                ))
              ) : (
                <div className="text-xs p-4 bg-white rounded-3xl text-zinc-500 text-center">
                  Aucune tâche démarrée
                </div>
              )}
            </ScrollShadow>
          </section>
        </div>

        {/* ---------------- MODAL ---------------- */}
        <Modal
          className="bg-neutral-100"
          onClose={() => setForm(null)}
          isOpen={form != null || isTaskDone}
        >
          <ModalContent>
            <ModalHeader>Exécution de la tâche</ModalHeader>
            <ModalBody>
              {isTaskDone && (
                <div className="flex flex-col items-center">
                  <p className="font-semibold text-lg mb-1">Tâche validée</p>
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
              <Button
                onPress={async () => {
                  if (isTaskDone) {
                    setIsTaskDone(false);
                    setNextGroups(null);
                    return;
                  }

                  const res = await fetch(
                    API_URL + "/next?task_id=" + taskId + "&email=" + email,
                    {
                      method: "POST",
                      headers: { "content-type": "application/json" },
                      body: JSON.stringify(formData),
                    },
                  );

                  const json = await res.json();

                  if (json.form) {
                    setForm(FormSchema.parse(json.form));
                  } else {
                    setForm(null);
                    setIsTaskDone(true);
                    if (json.next_groups) {
                      setNextGroups(json.next_groups);
                    }
                  }

                  refetch();
                  refetchStartedTasks();
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
