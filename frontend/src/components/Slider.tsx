import React from 'react';

interface SliderProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = Number(e.target.value);
    if (val < min) val = min;
    if (val > max) val = max;
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-xs font-bold text-text-main uppercase tracking-wider">
        {label} <span className="text-primary-red">*</span>
      </label>
      <div className="flex items-center gap-4 w-full">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-text-light rounded-lg appearance-none cursor-pointer accent-accent-green"
        />
        <div className="relative flex items-center">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={handleInputChange}
            className="w-20 px-3 py-2 border border-text-light rounded-lg text-sm text-center font-semibold focus:outline-hidden focus:ring-2 focus:ring-accent-green-light focus:border-accent-green"
          />
          <span className="absolute right-3 text-sm font-semibold text-text-muted select-none pointer-events-none">%</span>
        </div>
      </div>
    </div>
  );
};
