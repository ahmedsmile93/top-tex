import type { Customization } from "../types";
import { FaCheck } from "react-icons/fa";
import customization1 from "../assets/families/customizations/customization1.png";
import customization2 from "../assets/families/customizations/customization2.png";
import customization3 from "../assets/families/customizations/customization3.png";

const customizationImages = [customization1, customization2, customization3];

type Props = {
  customizations: Customization[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function CustomizationGrid({
  customizations,
  selectedId,
  onSelect,
}: Props) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {customizations.map((c, i) => {
        const isSelected = selectedId === c.id;
        const isDisabled = selectedId && !isSelected;

        return (
          <div
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`
            relative flex flex-col items-start text-start cursor-pointer
            p-4 rounded-xl shadow-sm border-2 transition-all duration-200
            ${isSelected ? "border-blue-600 bg-blue-100 scale-103" : ""}
            ${
              !isSelected && isDisabled
                ? "pointer-events-none opacity-60 filter grayscale"
                : ""
            }
            hover:!bg-blue-50 hover:border-blue-300
          `}
          >
            <img
              src={customizationImages[i]}
              alt={c.name}
              className="w-[270px] h-[200px] rounded-md object-cover"
            />
            <span
              className={`
              absolute top-6 right-6 w-6 h-6 rounded-full border-2 flex items-center justify-center text-blue-600
              ${isSelected ? "bg-blue-600 text-white" : "bg-transparent"}
              pointer-events-none
            `}
            >
              {isSelected ? <FaCheck className="text-sm" /> : null}
            </span>
            <h4 className="text-base font-semibold text-gray-900 mb-1">
              {c.name}
            </h4>
            <p className="text-sm text-gray-700 mb-1 leading-relaxed">
              {c.description}
            </p>
            <p className="text-xs text-gray-500 mt-auto italic">
              Delay: {c.delay}
            </p>
          </div>
        );
      })}
    </div>
  );
}
