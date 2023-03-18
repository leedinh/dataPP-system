import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";

const HomePage: React.FunctionComponent = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default HomePage;
