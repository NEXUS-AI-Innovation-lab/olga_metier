import { Button, Input } from "@heroui/react"
import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import useAuth from "../features/auth/hooks/useAuth"

export default () => {
    const navigate = useNavigate()
    const auth = useAuth()
    useEffect(() => {

        if (auth.login) navigate("/")
    }, [auth])
    const [email, setEmail] = useState("")

    return <div className="flex flex-col h-screen">
        <Navbar />
        <div className="flex-1 w-full flex items-center justify-center">
            <div className="w-120 flex gap-2 flex-col">
                <p className="text-2xl semiexpanded font-bold ">Se connecter</p>
                <p className="text-xs semiexpanded font-light pb-6">Vous pouvez vous connecter en tant que patient ou
                    bien en tant qu'infermier.</p>
                <Input value={email} onValueChange={setEmail} radius="full" label="Email" />
                <Input radius="full" label="Password" />
                <Button onPress={() => {
                    if (email == "infermier") {
                        localStorage.setItem("login", "infermier")
                        navigate("/")
                    } else if (email == "patient") {
                        localStorage.setItem("login", "patient")
                        navigate("/")
                    }
                }} color="primary" className="semiexpanded" radius="full">Se connecter</Button>
            </div>
        </div>
    </div>
}