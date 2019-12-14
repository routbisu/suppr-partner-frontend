module.exports = (() => {
  const environment = process.env.REACT_APP_ENV;
  let config = {};

  if (environment) {
    try {
      config = require(`./${environment}.json`);
      console.info(`Using configuration file for the environment ${environment}`);
    } catch (ex) {
      console.warn(`Missing configuration file for the environment ${environment}`);
    }
  }

  return Object.assign({}, config);
})();
