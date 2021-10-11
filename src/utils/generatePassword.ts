var generator = require("generate-password");

export const generatePass = () => {
  return generator.generate({
    length: 8,
    numbers: true,
    symbols: true,
    uppercase: true,
  });
};
