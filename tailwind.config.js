module.exports = {
  theme: {
    extend: {
      colors: {
        "dark-white": "rgb(189, 183, 175)",
        "dark-gray": "rgb(158, 149, 137)",
      },
    },
  },
  mode: "jit",
  purge: ["./frontend/**/*.{js,jsx,ts,tsx}", "./frontend/components/**/*.{js,jsx,ts,tsx}"],
};
