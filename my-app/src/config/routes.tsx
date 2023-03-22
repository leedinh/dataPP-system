import { createBrowserRouter } from "react-router-dom";
import {
  HomePage,
  SignUp,
  LogIn,
  UploadDataset,
  Step1,
  Step2,
  Step3,
  Step4,
} from "pages";
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
        children: [
          {
            index: true,
            element: <Step1 />,
          },
          {
            path: "step1",
            element: <Step1 />,
          },
          {
            path: "step2",
            element: <Step2 />,
          },
          {
            path: "step3",
            element: <Step3 />,
          },
          {
            path: "step4",
            element: <Step4 />,
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
