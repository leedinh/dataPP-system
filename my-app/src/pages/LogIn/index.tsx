import LogInForm from "./LogInForm";

const LogIn: React.FC = () => {
  return (
    <div className="w-screen h-screen grid grid-cols-2">
      <LogInForm />
      <div className="bg-cyan-400 h-screen rounded-bl"></div>
    </div>
  );
};

export default LogIn;