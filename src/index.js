const express = require('express');
const bcrypt = require('bcrypt');
const session = require('express-session');
const { User, Driver } = require('./config'); // Import the User and Driver models

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.use(express.static("public"));

// Session configuration
app.use(session({
    secret: "your-secret-key", // Change this to a secure key for production
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Redirect root to login
app.get("/", (req, res) => {
    res.redirect("/login");
});

// Render login page
app.get("/login", (req, res) => {
    res.render("login");
});

// Render signup page with role selection
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Render driver signup page
app.get("/driver_signup", (req, res) => {
    res.render("driver");
});

// Render user signup page
app.get("/user_signup", (req, res) => {
    res.render("user");
});

// Handle user signup
app.post("/signup", async (req, res) => {
    const { username, password, role, name, dob, email, number, address } = req.body;

    try {
        console.log('User Signup Request Body:', req.body); // Log the request body

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.send("User Already Exists. Choose a Different Username");
        }

        if (!password) {
            return res.status(400).send("Password is required");
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const userData = new User({
            name,
            username,
            password: hashedPassword,
            role,
            dob,
            email,
            number,
            address
        });

        await userData.save();
        res.redirect('/login');
    } catch (err) {
        console.error('Error during user signup:', err);
        res.status(500).send("Error signing up user");
    }
});

// Handle login
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        console.log('Login Request Body:', req.body); // Log the request body

        const user = await User.findOne({ username });
        if (!user) {
            return res.send("Username Not Found");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (isPasswordMatch) {
            req.session.user = user.username;
            res.redirect('/home');
        } else {
            res.send("Wrong Password");
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send("Error logging in");
    }
});

// Handle driver signup
app.post("/driver_signup", async (req, res) => {
    try {
        console.log('Driver Signup Request Body:', req.body); // Log the request body

        const { name, dob, email, number, address, licenseNo, licenseExpiry, vehicleType, username, password } = req.body;

        if (!password) {
            return res.status(400).send("Password is required");
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const driverData = new Driver({
            name,
            dob,
            email,
            number,
            address,
            licenseNo,
            licenseExpiry,
            vehicleType,
            username,
            password: hashedPassword
        });

        await driverData.save();
        res.send('Driver signup successful!');
    } catch (error) {
        console.error('Error during driver signup:', error);
        res.status(500).send('Error during driver signup');
    }
});

// Handle user signup
app.post("/user_signup", async (req, res) => {
    try {
        console.log('User Signup Request Body:', req.body); // Log the request body

        const { name, dob, email, number, address, username, password } = req.body;

        if (!password) {
            return res.status(400).send("Password is required");
        }

        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

        const userData = new User({
            name,
            dob,
            email,
            number,
            address,
            username,
            password: hashedPassword
        });

        await userData.save();
        res.send('User signup successful!');
    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).send('Error during user signup');
    }
});

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Render home page for authenticated users
app.get('/home', isAuthenticated, (req, res) => {
    res.render('home', { user: req.session.user });
});

// Handle logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error during logout:', err);
            return res.send('Error logging out');
        }
        res.redirect('/login');
    });
});

// Start the server
const port = 4000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});
