const when = require('when');
const crypto = require('crypto');

module.exports = function postCertificate(req, res) {
  // toSafeInteger returns 0 when nothing is provided, we don't want that
  const customerId = _.toSafeInteger(req.body.customer_id || -1);
  if (customerId < 1) return res.send({ statusCode: 400, message: 'Invalid id provided'});
  if (!_.isNumber(customerId)) return res.send({ statusCode: 400, message: 'Non integer id provided'});

  const db = req.app.get('db');
  return when(db.getCustomerById({ customerId }))
    .then((result) => {
      if (_.isEmpty(result)) return res.send({ statusCode: 404, message: 'Customer not found'});
      return when(db.createCertificate({
        customerId,
        privateKey: crypto.randomBytes(100),
        body: crypto.randomBytes(100),
      }))
        .then((response) => {
          return res.send({ statusCode: 201, resourceId: response.insertId, message: 'Certificate created' });
        })
        .catch((err) => {
          return res.send({ statusCode: 500, message: err.message });
        });
    })
    .catch((err) => {
      return res.send({ statusCode: 500, message: err.message });
    });
};
