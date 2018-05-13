const when = require('when');

module.exports = function getCertificatesByCustomerId(req, res) {
  // toSafeInteger returns 0 when nothing is provided, we don't want that
  const customerId = _.toSafeInteger(req.params.customer_id || -1)
  if (customerId < 1) return res.send({ statusCode: 400, message: 'Invalid id provided'});
  if (!_.isNumber(customerId)) return res.send({ statusCode: 400, message: 'Non integer id provided'});

  return when(req.app.get('db').getCertificatesByCustomerId({ customerId, }))
    .then((response) => {
      if (_.isEmpty(response)) return res.send({ statusCode: 200, message: { items: [] } });
      const items = _.map(response, item => {
        item.active = item.active === 1;
        return _.pick(item, ['id', 'active']);
      });
      const message = { items }
      return res.send({ statusCode: 200, message })
    })
    .catch((err) => {
      return res.send({ statusCode: 500, message: err.message });
    });
}
