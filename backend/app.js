global._ = require('lodash');
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.set('db', require('./db/database'));

// *** Routes ***
// Customers
app.get('/v1/customers/get', require('./routes/v1/customers/get.js'));
app.post('/v1/customers/post', require('./routes/v1/customers/post.js'));
app.delete('/v1/customers/:customer_id*/delete', require('./routes/v1/customers/:customer_id/delete.js'));
app.get('/v1/customers/:customer_id*/certificates/get', require('./routes/v1/customers/:customer_id/certificates/get.js'));

// Certificates
app.post('/v1/certificates/post', require('./routes/v1/certificates/post.js'))
app.put('/v1/certificates/:certificate_id*/activate/put', require('./routes/v1/certificates/:certificate_id/activate/put.js'));
app.put('/v1/certificates/:certificate_id*/deactivate/put', require('./routes/v1/certificates/:certificate_id/deactivate/put.js'));

app.use((req, res) => {
  res.send(
    {
      error: `${req.method} "${req.path}" not found`,
    }
  );
});


app.listen(3000, () => console.log('App listening on port 3000!'))
