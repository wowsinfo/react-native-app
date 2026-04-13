export function formatNumber(value: number | null | undefined): string {
  if (value == null) {
    return '0';
  }

  return new Intl.NumberFormat('en-US').format(Math.round(value));
}

export function formatDecimal(value: number | null | undefined, digits = 2): string {
  if (value == null) {
    return '0.00';
  }

  return value.toFixed(digits);
}

export function formatPercent(value: number | null | undefined, digits = 2): string {
  if (value == null) {
    return '0.00%';
  }

  return `${value.toFixed(digits)}%`;
}

export function formatUnixDate(value: number | null | undefined): string {
  if (!value) {
    return 'Unknown';
  }

  return new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value * 1000));
}

export function calculateWinRate(wins: number, battles: number): number | null {
  if (battles <= 0) {
    return null;
  }

  return (wins / battles) * 100;
}

export function calculateAverage(total: number, battles: number): number | null {
  if (battles <= 0) {
    return null;
  }

  return total / battles;
}

