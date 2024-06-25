import express from "express";

const routes = express.Router();
let Users = [];

routes.get("/", (req, res) => {
  res.send("Hello world");
});

routes.get("/signup", (req, res) => {
  const data = {
    title: "Sign Up",
    layout: "layouts/main-layout",
    message: "",
  };
  res.render("signup", data);
});

routes.post("/signup", (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    res.status(400);
    const data = {
      title: "Sign Up",
      layout: "layouts/main-layout",
      message: "Invalid data",
    };
    return res.render("signup", data);
  }

  const userExists = Users.some((user) => user.email === email);
  if (userExists) {
    res.status(400);
    const data = {
      title: "Sign Up",
      layout: "layouts/main-layout",
      message: "Email already exists",
    };
    return res.render("signup", data);
  }

  const newUser = { nama, email, password };
  Users.push(newUser);
  req.session.user = newUser;
  res.redirect("/protected-page");
});

function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Protected page route
routes.get("/protected-page", isLoggedIn, (req, res) => {
  const data = {
    title: "Protected Page",
    layout: "layouts/main-layout",
    message: "Welcome " + req.session.user.nama,
  };
  res.render("protected-page", data);
});

// Login page route
routes.get("/login", (req, res) => {
  const data = {
    title: "Login",
    layout: "layouts/main-layout",
    message: "",
  };
  res.render("login", data);
});

// Login form submission route
routes.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    const data = {
      title: "Login",
      layout: "layouts/main-layout",
      message: "Invalid data",
    };
    return res.render("login", data);
  }

  const user = Users.find(
    (user) => user.email === email && user.password === password
  );
  if (user) {
    req.session.user = user;
    res.redirect("/protected-page");
  } else {
    res.status(400);
    const data = {
      title: "Login",
      layout: "layouts/main-layout",
      message: "Invalid email or password",
    };
    res.render("login", data);
  }
});

routes.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

routes.use("/protected-page", (err, req, res, next) => {
  const data = {
    title: "Halaman Login",
    layout: "layouts/main-layout",
    message: err.message,
  };
  res.render("login", data);
});

export default routes;
