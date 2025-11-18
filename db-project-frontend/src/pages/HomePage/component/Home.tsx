import LogowithText from "../../../assets/LogowithText.svg";
import MainBackground from "../../../assets/MainBackground.png";
import GreenButton from "../../../components/GreenButton";
import WhiteButton from "../../../components/WhiteButton";

type HomeProps = {
  onPublicAccess?: () => void;
  onLogin?: () => void;
};


const Home = ({ onPublicAccess, onLogin }: HomeProps) => {
  return (
    <section className="flex flex-col md:flex-row items-center justify-between min-h-screen bg-white">
      {/* Left Section */}
      <div className="flex flex-col justify-center px-12 md:px-20 py-10 w-full md:w-1/2 space-y-6">
        <img
          src={LogowithText}
          alt="CrimeLens Logo"
          className="w-44 md:w-56 mb-6"
        />

        <div className="space-y-2 pt-12">
          <h1 className="text-4xl md:text-5xl font-outfit font-bold bg-linear-to-r from-[#145332] to-[#237E54] bg-clip-text text-transparent">
            Stay Informed.
          </h1>
          <h2 className="text-4xl md:text-5xl font-outfit font-bold bg-linear-to-r from-[#145332] to-[#237E54] bg-clip-text text-transparent">
            See Crime Clearly.
          </h2>
          <h3 className="text-4xl md:text-5xl font-outfit font-bold bg-linear-to-r from-[#145332] to-[#237E54] bg-clip-text text-transparent">
            Stay One Step Ahead.
          </h3>

          <p className="text-gray-800 text-sm md:text-base font-outfit font-medium leading-relaxed max-w-md pt-8">
            CrimeLens provides real-time crime analytics and insights across your city.
            Explore interactive maps, live statistics, and verified
            police reports to stay informed, aware, and proactive. Track ongoing
            incidents, understand local safety trends, and make smarter
            decisions — all in one dynamic dashboard.
          </p>
        </div>

        <div className="flex flex-row gap-4 pt-12">
          <GreenButton
            label="Proceed as a Public User"
            width={350}
            onClick={onPublicAccess} // ✅ added
          />
          <WhiteButton
            label="Login"
            width={100}
            onClick={onLogin} // ✅ added
          />
        </div>

      </div>

      {/* Right Section */}
      <div className="w-full md:w-1/2 h-[400px] md:h-screen flex items-center justify-center p-8">
        <img
          src={MainBackground}
          alt="Background"
          className="rounded-3xl shadow-lg object-cover w-full h-full"
        />
      </div>
    </section>
  );
};

export default Home;
