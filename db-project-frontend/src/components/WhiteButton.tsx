type WhiteButtonProps = {
  label: string;
  width?: number;
  height?: number;
  onClick?: () => void; // 👈 added
};

const WhiteButton = ({ label, width, height , onClick}: WhiteButtonProps) => {
  return (
    <button
      onClick={onClick} // 👈 added
      style={{ width, height }}
      className="bg-[#ffffff] rounded-4xl border-2 border-[#237E54] font-outfit font-medium py-3 px-5 items-center text-[#237E54] text-sm hover:bg-[#ebedec] cursor-pointer"
    >
      {label}
    </button>
  );
};

export default WhiteButton;
