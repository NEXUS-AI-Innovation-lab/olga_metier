import { Button } from "@heroui/react"
import React from "react"

type Props = {
    inventory: { code: string; description?: string; canStart?: boolean }
    onStart?: () => Promise<void> | void
}

export default function InventoryCard({ inventory, onStart }: Props) {
    return (
        <div className="text-xs p-3 bg-white rounded-3xl w-full flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="font-semibold">{inventory.code}</p>
                    <p className="opacity-50 text-[13px]">{inventory.description}</p>
                </div>
                {inventory.canStart ? (
                    <Button onPress={onStart} color="primary" size="sm" radius="full">Start</Button>
                ) : (
                    <span className="text-[12px] px-3 py-1 rounded-full bg-zinc-100 text-zinc-600">No start</span>
                )}
            </div>
        </div>
    )
}
