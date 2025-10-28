import WhiteLogo from "../assets/LogowithoutText-White.svg";
import WhiteButton from "./WhiteButton";
import MainBackground from "../assets/MainBackground.png";

const MeetCreatorsCard = () => {
  return (
    <div
      className="relative w-full max-w-[260px]  rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.15)]"
      style={{
        backgroundImage: `url(${MainBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for dark tint */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/25 to-transparent rounded-2xl"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between p-4 h-[200px] gap-y-2 text-white ">
        <img src={WhiteLogo} alt="Logo" className="w-6 h-6 ml-1" />

        <div className="ml-1 mt-1">
          <h2 className="text-md font-medium leading-tight">
            Meet the 
          </h2>
          <h3 className="text-3xl font-semibold leading-tight">
            Creators
          </h3>
          <p className="text-xs mt-2 text-[#ffffff]">Know more about us.</p>
        </div>

        <div className="mt-1">
          <WhiteButton label="See Now" width={207} height={45} />
        </div>
      </div>
    </div>
  );
};

export default MeetCreatorsCard;
