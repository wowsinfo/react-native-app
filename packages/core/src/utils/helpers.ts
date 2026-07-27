export const copy = (value: unknown) => {
  return JSON.parse(JSON.stringify(value));
};

export const random = (range: number) => {
  return Math.floor(Math.random() * range);
};

export const roundTo = (num?: number, digit = 0) => {
  if (num == null) return -1;
  if (isNaN(num) || !isFinite(num)) return -1;
  return Number(Number(num).toFixed(digit));
};

export const dayDifference = (time: number) => {
  const timeDiff = Math.abs(Date.now() / 1000 - time);
  return Math.ceil(timeDiff / (3600 * 24));
};

export const getRandomAnimation = () => {
  const list = [
    "bounce",
    "flash",
    "pulse",
    "rotate",
    "rubberBand",
    "shake",
    "swing",
    "tada",
    "wobble",
  ];
  return list[random(list.length)];
};
