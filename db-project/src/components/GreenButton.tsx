type GreenButtonProps = {
  label: string;
  width?: number;
  height?: number;
};

const GreenButton = ({ label, width }: GreenButtonProps) => {
  return (
    <button
      style={{ width }}
      className="bg-linear-to-r from-[#145332] to-[#237E54] rounded-4xl border-2 border-[#237E54] font-outfit font-normal py-[9px] px-5 items-center text-white text-sm hover:from-[#145332] hover:to-[#145332]"
    >
      {label}
    </button>
  );
};

export default GreenButton;
