import { Outlet } from "react-router-dom";

import NavBar from "components/NavBar";

const HomePage: React.FunctionComponent = () => {
  return (
    <div className="mx-8">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default HomePage;
