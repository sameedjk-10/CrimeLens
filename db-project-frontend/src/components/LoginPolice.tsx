import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // back arrow
import LogowithText from "../assets/LogowithText.svg";
import GreenButton from "./GreenButton";
import MainBackground from "../assets/MainBackground.png";
import PasswordSeeIcon from "../assets/PasswodSeeIcon.svg";
import PasswordHideIcon from "../assets/PasswodHideIcon.svg";

const LoginCreate = () => {
  // password visibility states
  const [showPassword, setShowPassword] = useState(false);

  return (
    <section
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${MainBackground})` }}
    >
      {/* White Card */}
      <div className="bg-white rounded-3xl shadow-xl flex flex-col px-8 py-8 w-11/12 max-w-md space-y-4 md:space-y-6">
        {/* Back Arrow */}
        <div className="flex items-center text-[#145332] cursor-pointer hover:underline text-sm">
          <ArrowLeft className="w-4 h-4 mr-1 text-[#ababab]" />
          <span className="text-[#ababab]">Back</span>
        </div>

        <div className="flex items-center flex-col md:space-y-6">
          {/* Logo */}
          <div className="flex justify-center ">
            <img src={LogowithText} alt="CrimeLens" className="w-44 md:w-52" />
          </div>

          {/* Title */}
          <h2 className="text-center font-outfit font-medium text-[#145332] text-md">
            Login as a Police Agent
          </h2>
        </div>

        {/* Form */}
        <form className="flex flex-col w-full space-y-4">
            <input
            type="text"
            placeholder="Username"
            className="border-2 border-[#d9d9d9] text-[#ababab] rounded-lg px-4 py-2 font-outfit text-sm focus:outline-none focus:border-[#237E54]"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="border-2 border-[#d9d9d9] text-[#ababab] rounded-lg px-4 py-2 w-full font-outfit text-sm focus:outline-none focus:border-[#237E54]"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-400 cursor-pointer"
            >
              <img
                src={showPassword ? PasswordHideIcon : PasswordSeeIcon}
                alt="toggle password visibility"
              />
            </span>
          </div>


          {/* Login Button */}
          <GreenButton label="Login" />
        </form>
      </div>
    </section>
  );
};

export default LoginCreate;
