import { createContext, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";

type AuthProps = {
    login: string | null
}

export const authContext = createContext<AuthProps | null>(null)

export default ({children} : {children : ReactNode}) => {
    const navigate = useNavigate()
    const [login, setLogin] = useState<null | string>(null)

    useEffect(() => {
        const loginStr = localStorage.getItem("login")
        if (loginStr){           
            setLogin(loginStr)
        } 
        else navigate("/login")
    }, [])

    return <authContext.Provider value={{login : login}}>
        {children}
    </authContext.Provider>
}