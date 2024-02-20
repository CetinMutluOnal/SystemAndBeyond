import 'dotenv/config';

import express, { urlencoded, json } from 'express';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import pkg from 'connect-mongo';
const { create } = pkg;
import connectDB from './server/config/db.js';
import session from 'express-session';
import isActiveRoute from './server/helpers/routeHelpers.js';
import webRoutes from './server/routes/web/main.js';
import adminRoutes from './server/routes/admin/admin.js';
import categoryRoutes from './server/routes/admin/category.js';


const app = express();
const PORT = 5000 || process.env.PORT;

// Connect to DB

connectDB();

app.use(urlencoded({ extended: true}));
app.use(json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    store: create({
        mongoUrl: process.env.MONGODB_URI
    })
}))

app.use(express.static('public'));


//TEMPLATING ENGINE
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.locals.isActiveRoute = isActiveRoute;

app.use('/', webRoutes);
app.use('/', adminRoutes);
app.use('/', categoryRoutes);

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});