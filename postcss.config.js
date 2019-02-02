const autoprefixer = require('autoprefixer');

module.exports = {
  parser: false,
  plugins: [
    autoprefixer({
      browsers: [
        ">0.25%",
        "not ie 11",
        "not op_mini all"
      ],
    }),
  ],
};
