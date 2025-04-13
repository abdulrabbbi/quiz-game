export const AnswerChoice = ({ 
  choice, 
  onSelect, 
  isSelected, 
  disabled,
  bgColor,
  icon
}) => {
  return (
    <button
      onClick={() => onSelect(choice)}
      disabled={disabled}
      className={`
        flex items-center justify-between
        py-4 px-6 text-lg rounded-md border transition-all
        ${bgColor || 'bg-white hover:bg-gray-50'}
        ${isSelected ? 'border-2' : 'border'}
        ${disabled ? 'opacity-100 cursor-default' : 'cursor-pointer'}
      `}
    >
      <span>{choice}</span>
      {icon}
    </button>
  );
};