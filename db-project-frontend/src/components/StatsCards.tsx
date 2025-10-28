import ArrowButton from "./ArrowButton";
import StatsCardLiveIcon from "./StatsCardLiveIcon";

interface StatsCardProps {
  title: string;
  value: number | string;
  subText: string;
  bgColor?: string; // Solid color background (Tailwind or hex)
  gradientBg?: string; // New: gradient background class or inline style
  width?: string;
  height?: string;
  mainTextColor?: string;
  smallTextColor?: string;
  arrowProps?: {
    size?: number;
    bgColor?: string;
    iconColor?: string;
    hoverBgColor?: string;
    hoverIconColor?: string;
  };
}

const StatsCard = ({
  title,
  value,
  subText,
  bgColor = "bg-white",
  gradientBg,
  width = "w-[280px]",
  height = "h-[160px]",
  mainTextColor = "text-black",
  smallTextColor = "text-green-600",
  arrowProps,
}: StatsCardProps) => {
  return (
    <div
      className={`${width} ${height} rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 shadow-[0_0_5px_rgba(0,0,0,0.15)] ${
        gradientBg ? "" : bgColor
      }`} // only apply bgColor if no gradient
      style={
        gradientBg?.startsWith("linear-gradient")
          ? { background: gradientBg } // inline linear-gradient CSS
          : undefined
      }
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <p className={`text-base font-medium ${mainTextColor}`}>{title}</p>
        <ArrowButton {...arrowProps} />
      </div>

      {/* Middle Section */}
      <h2 className={`text-6xl font-normal mb-4 leading-none ${mainTextColor}`}>
        {value}
      </h2>

      {/* Bottom Section */}
      <div className="flex items-center gap-2">
        <StatsCardLiveIcon colorClass={smallTextColor} size={12} />
        <p className={`text-sm font-medium ${smallTextColor}`}>{subText}</p>
      </div>
    </div>
  );
};

export default StatsCard;
