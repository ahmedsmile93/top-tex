import ProductCard from "./ProductCard";
import type { Product } from "../types";

type Props = {
  products: Product[];
  selectedCode: string | null;
  isLocked: boolean;
  onSelect: (code: string) => void;
  selectedFamily: string | null;
};

export const GRID_CLASS_3 = "grid-3";
export const GRID_CLASS_4 = "grid-4";
export const GRID_CLASS_DEFAULT = "grid-5";

const getGridClass = (count: number): string => {
  switch (count) {
    case 3:
      return GRID_CLASS_3;
    case 4:
      return GRID_CLASS_4;
    default:
      return GRID_CLASS_DEFAULT;
  }
};

export default function ProductGrid({
  products,
  selectedCode,
  isLocked,
  onSelect,
  selectedFamily,
}: Props) {
  const gridClass = getGridClass(products.length);

  return (
    <div
      className={`grid mt-4 gap-4 ${
        gridClass === "grid-3"
          ? "grid-cols-3"
          : gridClass === "grid-4"
          ? "grid-cols-4"
          : "grid-cols-5"
      }`}
    >
      {products.map((product, index) => {
        const isSelected = selectedCode === product.id;

        // Disable only if:
        // - selection locked
        // - product not selected
        // - product belongs to the same family as the selected one
        const isDisabled =
          isLocked &&
          !isSelected &&
          selectedFamily !== null &&
          product.family === selectedFamily;

        return (
          <ProductCard
            key={product.code}
            index={index}
            product={product}
            isSelected={isSelected}
            isDisabled={isDisabled}
            onSelect={() => {
              const isSameFamily =
                selectedFamily !== null && product.family === selectedFamily;

              if (!isLocked || !isSameFamily) {
                onSelect(product.id);
              }
            }}
          />
        );
      })}
    </div>
  );
}
