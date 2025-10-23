import LogowithText from "../assets/LogowithText.svg";
import GreenButton from "./GreenButton";
import WhiteButton from "./WhiteButton";
import MainBackground from "../assets/MainBackground.png";

const Login = () => {
  return (
    <section
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${MainBackground})` }}
    >
      {/* White Card Container */}
      <div className="bg-white rounded-3xl shadow-xl flex flex-col items-center justify-center px-8 py-8 w-11/12 max-w-md space-y-6 md:space-y-8">
        {/* Logo */}
        <img src={LogowithText} alt="CrimeLens" className="w-40 md:w-48 mb-8" />

        {/* White Outline Buttons */}
        <div className="flex flex-col w-full space-y-4 gap-y-4">
          <WhiteButton label="Create a new Police Agent" />
          <hr className="border-t-2 border-[#ebebeb] mx-4" />
          <WhiteButton label="Login as an Administrator" />
          <WhiteButton label="Login as a Police Agent"/>
          <hr className="border-t-2 border-[#ebebeb] mx-4" />
          <GreenButton label="Back to Home"/>
        </div>

      </div>
    </section>
  );
};

export default Login;
