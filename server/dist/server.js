"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var auth_1 = require("./middlewares/auth");
var committes_1 = require("./routes/committes");
var journalists_1 = require("./routes/journalists");
var login_1 = require("./routes/login");
var posts_1 = require("./routes/posts");
var signUp_1 = require("./routes/signUp");
var users_1 = require("./routes/users");
var PORT = process.env.PORT || 8080;
app_1.app.use("/journalists", journalists_1.router);
app_1.app.use("/posts", posts_1.postsRouter);
app_1.app.use("/committes", committes_1.committesRouter);
app_1.app.use("/users", users_1.usersRouter);
app_1.app.use("/login", login_1.loginRouter);
app_1.app.use("/signup", signUp_1.signUpRouter);
app_1.app.use(auth_1.auth);
app_1.app.listen(PORT, function () { return console.log("listening on port: " + PORT); });
