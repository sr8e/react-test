import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { fetch_api } from "../fetch"

type PaymentDetailItem = {
    id: number
    amount: number
    date: string
    shop: string
    genre: number
    gname: string
    method: number
    mname: string
    attr: string
    note: string
    not_own: boolean
}

export const PaymentDetailView = () => {
    const { month, genre } = useParams()
    const navigate = useNavigate()
    const [records, setRecords] = useState<PaymentDetailItem[]>([])
    useEffect(() => {
        const qs = `month=${month}` + (genre !== undefined ? `&genre=${genre}` : "")
        fetch_api(navigate, "/api/payment/detail?" + qs, "GET").then(({ status, data }) => {
            setRecords(data)
        })
    }, [])
    return (
        <div>
            {month} {genre}
            <div className="Payment-detail-container">
                {records.map((v, i) => (
                    <PaymentDetailCard item={v} key={`rec-${i}`} />
                ))}
            </div>
        </div>
    )
}

export const PaymentDetailCard = ({ item }: { item: PaymentDetailItem }) => {
    console.log(Object.keys(item))
    return (
        <div className="Payment-card">
            <div className="Payment-card-left">
                <div>
                    <span className="Payment-card-date">{item.date}</span>
                    <span>{item.shop}</span>
                </div>
                <div>
                    <span className="Payment-card-props">{item.gname}</span>
                    <span className="Payment-card-props">{item.attr || "--"}</span>
                    <span className="Payment-card-props">{item.mname}</span>
                </div>
            </div>
            <div className="Payment-card-right">{item.amount}</div>
        </div>
    )
}
