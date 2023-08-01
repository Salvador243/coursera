const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bodyParser = require('body-parser'); // Agregar esta línea
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(bodyParser.urlencoded({ extended: true })); // Agregar esta línea
app.use(express.json());
app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

app.use("/customer/auth/*", function auth(req, res, next) {
    const secretKey = 'wordSecret';
    const token = req.headers['token'];
    if (!token) {
        return res.status(401).json({ message: "Token not provided" });
    }
    try {
        const decodedToken = jwt.verify(token, secretKey);
        const { username } = decodedToken;
        req.username = username;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
