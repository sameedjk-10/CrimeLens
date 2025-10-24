type WhiteButtonProps = {
  label: string;
  width?: number;
  height?: number;
};

const GreenButton = ({ label, width }: WhiteButtonProps) => {
  return (
    <button
      style={{ width }}
      className="bg-white-500 rounded-4xl border-2 border-[#237E54] font-outfit font-medium py-3 px-5 items-center text-[#237E54] text-sm hover:bg-[#ebedec] cursor-pointer"
    >
      {label}
    </button>
  );
};

export default GreenButton;
