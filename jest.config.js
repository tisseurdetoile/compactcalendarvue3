module.exports = {
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    '^.+\\.mjs$': 'babel-jest',
    "^.+\\.vue$": "vue-jest"
  }
};
