import 'dotenv/config';

import express, { urlencoded, json } from 'express';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import multer from 'multer';
import pkg from 'connect-mongo';
const { create } = pkg;
import connectDB from './server/config/db.js';
import session from 'express-session';
import isActiveRoute from './server/helpers/routeHelpers.js';
import webRoutes from './server/routes/web/main.js';
import adminAuthRoutes from './server/routes/admin/auth.js';
import adminCategoryRoutes from './server/routes/admin/category.js';
import adminPostRoutes from './server/routes/admin/post.js';
import adminUsersRoutes from './server/routes/admin/user.js';
import webAuthorRoutes from './server/routes/web/author.js';


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
app.use('/admin', adminAuthRoutes);
app.use('/admin', adminCategoryRoutes);
app.use('/admin', adminPostRoutes);
app.use('/admin', adminUsersRoutes);
app.use('/',webAuthorRoutes);

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});