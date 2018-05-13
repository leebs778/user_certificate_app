const when = require('when');

module.exports = function deleteCustomer(req, res) {
  // toSafeInteger returns 0 when nothing is provided, we don't want that
  const customerId = _.toSafeInteger(req.params.customer_id || -1)
  if (customerId < 1) return res.send({ statusCode: 400, message: 'Invalid id provided'});
  if (!_.isNumber(customerId)) return res.send({ statusCode: 400, message: 'Non integer id provided'});

  return when(req.app.get('db').deleteCustomerById({ customerId, }))
    .then((response) => {
      if (response.affectedRows === 0) return res.send({ statusCode: 404, message: `User id ${customerId} not found` });

      // delete any certificates they had
      return when(req.app.get('db').deleteCertificatesByCustomerId({ customerId, }))
        .then((response) => {
          return res.send({ statusCode: 204, resourceId: response.insertId, message: `User with id ${customerId} deleted` });
        })
        .catch((err) => {
          return res.send({ statusCode: 500, message: err.message });
        });
    })
    .catch((err) => {
      return res.send({ statusCode: 500, message: err.message });
    });
}
