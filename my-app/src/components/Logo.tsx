import logo from "assets/logo.png";

const Logo: React.FC = () => {
  return (
    <div className="flex h-10 py-2 px-5 rounded-3xl bg-indigo-600">
      <div className="self-center mr-2">
        <img src={logo} width={25} alt="#" />
      </div>
      <div className="text-3xl text-white font-bold self-center">Brand</div>
    </div>
  );
};

export default Logo;
