import logo from "assets/logo.png";
import { useNavigate } from "react-router-dom";

const Logo: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      className="hover:cursor-pointer flex h-10 py-2 px-5 rounded-3xl bg-indigo-600"
    >
      <div className="self-center mr-2">
        <img src={logo} width={25} alt="#" />
      </div>
      <div className="text-3xl text-white font-bold self-center">PrivOpen</div>
    </div>
  );
};

export default Logo;
