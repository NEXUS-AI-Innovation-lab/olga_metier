import { Button } from "@heroui/react"
import React from "react"

type Props = {
    task: any
    actionLabel?: string
    onAction?: () => Promise<void> | void
    onClick?: () => void
}

export default function TaskCard({ task, actionLabel = "Open", onAction, onClick }: Props) {
    return (
        <div className="text-xs p-3 bg-white rounded-3xl w-full flex items-center gap-3 shadow-sm">
            <div className="flex-1" onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
                <p className="font-semibold">{task.inventory_code}</p>
                <p className="opacity-50 text-[13px]">{String(task.current_node_id ?? "En attente")}</p>
            </div>
            {onAction && <Button onPress={onAction} color="primary" size="sm" radius="full">{actionLabel}</Button>}
        </div>
    )
}