import { createBrowserRouter } from "react-router-dom";
import { HomePage, SignUp, LogIn, UploadDataset } from "pages";
import Main from "pages/Home/Main";

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
        path: "home",
        element: <Main />,
      },
      {
        path: "upload",
        element: <UploadDataset />,
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
