export function random(range: number): number {
  return Math.floor(Math.random() * range);
}

export function roundTo(num?: number, digit = 0): number {
  if (num == null || Number.isNaN(num) || !Number.isFinite(num)) {
    return Number(-1);
  }

  return Number(num.toFixed(digit));
}

export function dayDifference(time: number): number {
  const timeDiff = Math.abs(Date.now() / 1000 - time);
  return Math.ceil(timeDiff / (3600 * 24));
}
