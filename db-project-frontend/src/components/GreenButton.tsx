type GreenButtonProps = {
  label: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  rounded?: string; // NEW optional prop
  type?: 'submit' | 'reset';
};

export default function GreenButton({
  label,
  width,
  height,
  onClick,
  type,
  rounded = "4xl", // default value
}: GreenButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{ width, height }}
      className={`bg-linear-to-r from-[#145332] to-[#237E54] rounded-${rounded} border-2 border-[#237E54] font-outfit font-normal py-2 px-5 items-center text-white text-sm hover:from-[#145332] hover:to-[#145332] cursor-pointer`}
    >
      {label}
    </button>
  );
}
