export const LifeCounter = ({ lives }) => (
    <div className="flex items-center">
      {[...Array(3)].map((_, i) => (
        <span 
          key={i} 
          className={`h-3 w-3 rounded-full mx-1 ${i < lives ? 'bg-green-500' : 'bg-gray-300'}`}
        />
      ))}
    </div>
  );