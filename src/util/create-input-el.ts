export default (type: string, name: string, value?: string) => {
  const input: HTMLInputElement = document.createElement('input');

  Object.assign(input, { type, name, value });

  return input;
};
