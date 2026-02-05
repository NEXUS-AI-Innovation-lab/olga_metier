import { Button, Input } from "@heroui/react"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import useAuth from "../features/auth/hooks/useAuth"
import { BiSolidRightArrow } from "react-icons/bi"

const users = [
    {
        email : "infermier@gmail.com",
        role : "Infermier"
    },
    {
        email : "patient@gmail.com",
        role : "Patient"
    },
    {
        email : "medecin@gmail.com",
        role : "Medecin"
    }
]

export default () => {
    const navigate = useNavigate()
    const auth = useAuth()
    useEffect(() => {
        if (auth.login) navigate("/dash")
    }, [auth])
    const [email, setEmail] = useState("")

    return <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 w-full flex items-center justify-center">
            <div className="w-120 flex gap-2 flex-col">
                <p className="text-2xl semiexpanded font-bold ">Se connecter</p>
                <p className="text-xs semiexpanded font-light pb-6">Vous pouvez vous connecter en tant que patient ou
                    bien en tant qu'infermier.</p>
                {users.map(e=><div onClick={async ()=>{
                    await localStorage.setItem("login", e.email)
                    navigate("/dash")
                }} className="p-3 px-6 transition-all cursor-pointer hover:scale-105 flex items-center justify-between bg-neutral-100 rounded-full">
                    <div className="flex text-xs flex-col">
                        <p>{e.email}</p>
                        <p className="opacity-50">{e.role}</p>
                    </div>
                    <BiSolidRightArrow className="opacity-50" size={13} />
                </div>)}
                {/* <Button onPress={() => {
                    localStorage.setItem("login", email)
                    navigate("/")
                }} color="primary" className="semiexpanded" radius="full">Se connecter</Button> */}
            </div>
        </div>
    </div>
}