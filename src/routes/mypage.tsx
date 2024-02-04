import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetch_api } from "../fetch"

export const MyPage = () => {
    let accessed = false
    const [payments, setPayments] = useState(new Map())
    const [genres, setGenres] = useState(new Map())
    const navigate = useNavigate()

    useEffect(() => {
        if (accessed) {
            return
        }
        fetch_api(navigate, "/api/payment", "GET").then(
            ({ data }) => {
                if (data !== undefined) {
                    const paymentMap = data.reduce((map: Map<string, any>, v: { total: number, month: string, genre: number }) => {
                        if (!map.has(v.month)) {
                            return map.set(v.month, { [v.genre]: v.total, sum: v.total })
                        }
                        else {
                            const m = map.get(v.month)
                            m[v.genre] = v.total
                            m.sum += v.total
                            return map
                        }
                    }, new Map())
                    setPayments(paymentMap)
                }
            }
        )
        fetch_api(navigate, "/api/choices", "GET").then(
            ({ data }) => {
                if (data !== undefined) {
                    setGenres(new Map(Object.entries(data.genres).map(([k, v]) => [parseInt(k), v])))
                }
            }
        )
        accessed = true
    }, [])

    return <div>
        <table>
            <thead>
                <tr>
                    <th>month</th>
                    {[...genres.values()].map((v, i) => <th key={`gh-${i}`}>{v}</th>)}
                    <th>sum</th>
                </tr>
            </thead>
            <tbody>
                {[...payments.entries()].map(([k, v], i) => <tr key={`d-${i}`}>
                    <td key={`d-${i}-index`}>{k}</td>
                    {[...genres.keys()].map(gk => <td key={`d-${i}-g-${gk}`}>{v[gk]}</td>)}
                    <td key={`d-${i}-sum`}>{v.sum}</td>
                </tr>)}
            </tbody>

        </table>
        <p>aa</p></div>
}