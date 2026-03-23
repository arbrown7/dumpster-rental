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

const termsPage = (req, res) => {
    res.render('terms', {title: 'Rules and Liability Terms'});
}

export { 
  homePage, 
  aboutPage, 
  faqPage, 
  termsPage 
};