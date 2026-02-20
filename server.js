const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules', 'bootstrap', 'dist')));

app.get('/', (req, res) => {
	res.render('dumpsterForm');
});

app.post('/dumpster', (req, res) => {
	const data = {
		size: req.body.size,
		name: req.body.name,
		phone: req.body.phone,
		organization: req.body.organization,
		address: req.body.address,
		placement: req.body.placement,
		deliveryDate: req.body.deliveryDate,
		pickupDate: req.body.pickupDate,
		agreement: req.body.agreement,
	};

	if (!data.agreement) {
		return res.status(400).send('You must accept the agreement.');
	}

	res.render('confirmation', { data });
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
