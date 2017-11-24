const context = require.context('./test/reducer/tests', true, /\.spec\.js$/);
// console.log(context);
context.keys().forEach(context);
