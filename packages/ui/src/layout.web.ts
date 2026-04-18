export function currDeviceWidth() {
  return typeof window === 'undefined' ? 0 : window.innerWidth;
}

export function bestCellWidth(target: number) {
  const deviceWidth = currDeviceWidth();
  const usualCount = deviceWidth / target;
  return usualCount > 6 ? deviceWidth / 6 : target;
}

export function bestCellWidthEven(target: number) {
  const deviceWidth = currDeviceWidth();
  const usualCount = deviceWidth / target;
  return deviceWidth / Math.max(1, Math.floor(usualCount));
}

export function bestWidth(width: number, deviceWidth = currDeviceWidth()) {
  const maxCount = Math.round(deviceWidth / width);
  return deviceWidth / Math.max(1, maxCount);
}
