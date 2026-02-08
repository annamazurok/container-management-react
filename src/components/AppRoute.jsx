import {Route, Routes} from "react-router-dom";
import Layout from "./Layout"
import Home from "../pages/Home"
import TodoPage from "../pages/TodoPage";

export default function AppRoute(){
    return(
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="containers" element={<ContainersPage />} />
          </Route>
        </Routes>
    )
};