import { createBrowserRouter } from "react-router-dom";
import { HomePage, SignUp, LogIn, UploadDataset } from "pages";
import Main from "pages/Home/Main";
import RequiredAuth from "components/RequiredAuth";
import Profile from "pages/Profile";

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
        element: <RequiredAuth />,
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
