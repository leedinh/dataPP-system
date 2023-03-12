import { createBrowserRouter, Navigate } from "react-router-dom";
import { HomePage, SignUp, LogIn, UploadDataset } from "pages";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/signUp",
    element: <SignUp />,
  },
  {
    path: "/logIn",
    element: <LogIn />,
  },
  {
    path: "/upload",
    element: <UploadDataset />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
export default routes;
