export function formatTemplate(
  template: string,
  ...values: Array<string | number>
): string {
  return values.reduce<string>((output, value, index) => {
    return output.replaceAll(`{${index}}`, String(value));
  }, template);
}
