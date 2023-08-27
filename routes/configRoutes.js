const indexR = require("./index");
const usersR = require("./users");
const phonesR = require("./phones");
const booksR = require("./books");

exports.routesInit = (app) => {
  app.use("/", indexR);
  app.use("/users", usersR);
  app.use("/phones", phonesR);
  app.use("/books", booksR);
};
