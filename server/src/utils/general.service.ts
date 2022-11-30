export const nameOf = (f) => f.toString().replace(/[ |\(\)=>]/g, '');
export const toCamelCase = function (string) {
  return string.replace(/\s+(.)/g, function (match, group) {
    return group.toUpperCase();
  });
};
