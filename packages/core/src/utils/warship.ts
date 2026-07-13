export const getTierList = (): string[] => {
  return ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "★"];
};

export const getTierLabel = (tier: number): string => {
  if (tier < 1) {
    console.error("getTierLabel: Invalid tier: " + tier);
    return "O";
  }
  const label = getTierList();
  return label[tier - 1];
};

export const getColourWithRange = (
  min: number,
  curr: number,
  max: number,
): string => {
  if (curr < min) return "#FF0000";
  const scale = Number(((curr - min) / (max - min)) * 100);

  const componentToHex = (c: number): string => {
    let hex = c.toString(16);
    hex = hex.substring(0, 2);
    return hex.length === 1 ? "0" + hex : hex;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  };

  const G = (255 * scale) / 100;
  const R = (255 * (100 - scale)) / 100;
  return rgbToHex(R, G, 0);
};

export const getKeyByValue = (object: any, value: any): string | undefined => {
  return Object.keys(object).find((key) => object[key] === value);
};
