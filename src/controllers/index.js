// Route handlers for static pages
const homePage = (req, res) => {
    res.render('home', { title: 'Home' });
};

const aboutPage = (req, res) => {
    res.render('about', { title: 'About' });
};

const faqPage = (req, res) => {
    res.render('faq', {title: 'Frequently Asked Questions'});
}

export { homePage, aboutPage, faqPage };