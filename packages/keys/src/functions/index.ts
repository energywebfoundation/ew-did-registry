import { createHash } from 'crypto';

const hex = {
  encode: (data: string): string => {
    let result = '';

    for (let i = 0; i < data.length; i += 1) {
      const hexValue = data.charCodeAt(i).toString(16);
      result += (`000${hexValue}`).slice(-4);
    }

    return result;
  },
};

const sha256 = (data: string): string => createHash('sha256').update(data).digest('hex');

export {
  hex,
  sha256,
};
