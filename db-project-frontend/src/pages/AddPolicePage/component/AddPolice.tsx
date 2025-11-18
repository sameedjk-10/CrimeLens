import { useState } from "react";
import { ArrowLeft } from "lucide-react"; // back arrow
import LogowithText from "../assets/LogowithText.svg";
import GreenButton from "../../../components/GreenButton";
import MainBackground from "../assets/MainBackground.png";
import PasswordSeeIcon from "../assets/PasswodSeeIcon.svg";
import PasswordHideIcon from "../assets/PasswodHideIcon.svg";
import InstructionIcon from "../assets/InstructionIcon.svg";


type AddPoliceProps = {
  OnSubmit?: () => void;
};


const LoginCreate = ({OnSubmit}: AddPoliceProps) => {
  // password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
            <img src={LogowithText} alt="CrimeLens" className="w-44 md:w-52 " />
          </div>

          {/* Title */}
          <h2 className="text-center font-outfit font-medium text-[#145332] text-md">
            Creating a new Police Agent
          </h2>
        </div>

        {/* Form */}
        <form className="flex flex-col w-full space-y-4">
          <input
            type="text"
            placeholder="Branch ID"
            className="border-2 border-[#d9d9d9] text-[#ababab] rounded-lg px-4 py-2 font-outfit text-sm focus:outline-none focus:border-[#237E54]"
          />
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

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              className="border-2 border-[#d9d9d9] text-[#ababab] rounded-lg px-4 py-2 w-full font-outfit text-sm focus:outline-none focus:border-[#237E54]"
            />
            <span
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2 text-gray-400 cursor-pointer"
            >
              <img
                src={showConfirm ? PasswordHideIcon : PasswordSeeIcon}
                alt="toggle confirm password visibility"
              />
            </span>
          </div>

          {/* Info Box */}
          <div className="flex items-center gap-3 border-2 border-[#00A6FB] bg-[#F1F9FF] rounded-lg p-3">
            <img
              src={InstructionIcon}
              alt="Info"
              className="w-7 h-7 shrink-0 self-center"
            />
            <p className="text-sm text-[#00A6FB] font-outfit font-medium leading-snug">
              Submit request and then wait for manual verification call to
              finalize creation of a new agent for your branch.
            </p>
          </div>

          {/* Submit Button */}
          <GreenButton label="Submit Request" onClick={OnSubmit}/>
        </form>
      </div>
    </section>
  );
};

export default LoginCreate;
