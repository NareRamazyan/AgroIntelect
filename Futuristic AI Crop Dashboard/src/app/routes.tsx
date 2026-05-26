import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { Analysis } from "./pages/Analysis";
import { History } from "./pages/History";
import { NotFound } from "./pages/NotFound";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "analysis", Component: Analysis },
      { path: "history", Component: History },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);