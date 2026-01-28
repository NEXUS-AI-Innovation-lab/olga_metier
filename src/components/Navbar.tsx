import { Button } from "@heroui/react"

export default ()=>{
    return <div className="flex flex justify-between bg-neutral-50 px-50 py-3 ">
        <h1 className="text-xl kings font-bold tracking-wider">DOCTOLIB</h1>
        <div className="flex  items-center">
             <Button size="sm" radius="full" className="font-semibold" color="primary">Se connecter</Button>
        </div>
    </div>
}