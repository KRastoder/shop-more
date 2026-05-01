"use client";

type Props = {
  colors: string[];
  selectedColor: string;
  setSelectedColor: (color: string) => void;
};

export default function ColorSelector({
  colors,
  selectedColor,
  setSelectedColor,
}: Props) {
  return (
    <div className="flex gap-2 mt-2">
      {colors.map((color) => (
        <button
          key={color}
          onClick={() => setSelectedColor(color)}
          className={`px-3 py-1 rounded-full border text-sm transition w-10 h-10
            ${
              selectedColor === color
                ? "bg-black text-white border-black"
                : "bg-white text-gray-500 border-gray-300"
            }
          `}
        ></button>
      ))}
    </div>
  );
}
