const transformSearchTextRegexp = (text) => {
  const escapeRegExp = (string) =>
    string.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  const specialCharacters = [
    "aàáãảạăằắẳẵặâầấẩẫậ",
    "eèéẻẽẹêềếểễệ",
    "dđ",
    "uùúủũụưừứửữự",
    "oòóỏõọôồốổỗộơờớởỡợ",
    "iìíỉĩị",
    "yýỳỹỵỷ",
  ];

  return escapeRegExp(text)
    .toLocaleLowerCase()
    .split("")

    .map((item) => {
      const specialChar = specialCharacters.find((sc) => sc.includes(item));
      if (!specialChar) return item;
      return `[${specialChar.split("").join("")}]`;
    })

    .join("");
};
module.exports = { transformSearchTextRegexp };
