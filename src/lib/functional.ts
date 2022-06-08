export const splitAndJoin = (value: string) => value.split(',').join(' ');

export const parseExtension = (value: unknown) => {
  if (typeof value === 'string') {
    return splitAndJoin(value);
  }
  return '';
};
