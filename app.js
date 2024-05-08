import 'dotenv/config';

import express, { urlencoded, json } from 'express';
import expressLayouts from 'express-ejs-layouts';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
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
import webCategoryRoutes from './server/routes/web/category.js';
import webAboutRoutes from './server/routes/web/about.js';


const app = express();
const PORT = 5000 || process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true,limit: '5mb'}));


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
app.use('/', webAuthorRoutes);
app.use('/category', webCategoryRoutes);
app.use('/about', webAboutRoutes)

app.use(function (req,res,next) {
    res.status(404).render('response/notfound',{
        layout: 'layouts/main',
        currentRoute:'/',
    });
})

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});