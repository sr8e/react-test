import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    const [link, setLink] = useState("")
    let accessed = false

    const navigate = useNavigate()

    useEffect(() => {
        if (!accessed) {
            fetch("/auth/login?link=1", { "method": "GET" })
                .then(
                    res => res.json()
                ).then(
                    obj => {
                        if (obj.authorized) {
                            navigate('/mypage')
                        } else {
                            setLink(obj.link)
                        }
                    }
                )
            accessed = true
        }
    }, [])

    return <a href={link}>Log in with Google</a>
}