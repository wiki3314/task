const env = process.env.NODE_ENV || "staging";
console.log(env);
const config = require(`./${env}`);

export default config;
