import { createBrowserRouter } from "react-router-dom";
import { HomePage, SignUp, LogIn, UploadDataset } from "pages";
import Main from "pages/Home/Main";
import Profile from "pages/Profile";
import Admin from "pages/Admin";
import { ProtectedRoute } from "components/ProtectedRoute";
import UserManagement from "pages/Admin/Users";
import DatasetManagement from "pages/Admin/Datasets";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/upload",
            element: <UploadDataset />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
      {
        path: "admin",
        element: <Admin />,
      },
    ],
  },
  {
    path: "signUp",
    element: <SignUp />,
  },
  {
    path: "logIn",
    element: <LogIn />,
  },
]);
export default routes;
