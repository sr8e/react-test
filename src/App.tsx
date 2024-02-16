import React from "react"
import logo from "./logo.svg"
import "./App.css"
import { useEffect, useState } from "react"
import { Link, Outlet, Route, Routes, useNavigate } from "react-router-dom"

import { Top } from "./routes/top"
import { Login } from "./routes/login"
import { MyPage } from "./routes/mypage"
import { PaymentInputForm } from "./routes/input"
import { ChoiceUpdateDeleteForm, GenreListCreateForm, MethodListCreateForm } from "./routes/setting"
import { PaymentDetailView } from "./routes/detail"

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <Link to="/input" className="Header-link">
                    input
                </Link>
                <Link to="/mypage" className="Header-link">
                    my page
                </Link>
            </header>
            <Routes>
                <Route path="/" element={<Top />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mypage" element={<MyPage />} />
                <Route path="/input" element={<PaymentInputForm />} />
                <Route path="/setting/genre" element={<Outlet />}>
                    <Route index element={<GenreListCreateForm />} />
                    <Route path=":itemId" element={<ChoiceUpdateDeleteForm itemName="genre" />} />
                </Route>
                <Route path="/setting/method" element={<Outlet />}>
                    <Route index element={<MethodListCreateForm />} />
                    <Route path=":itemId" element={<ChoiceUpdateDeleteForm itemName="method" />} />
                </Route>
                <Route path="/detail/:month" element={<Outlet />}>
                    <Route index element={<PaymentDetailView />} />
                    <Route path="genre/:genre" element={<PaymentDetailView />} />
                </Route>
            </Routes>
        </div>
    )
}

export default App
