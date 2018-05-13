const when = require('when');

module.exports = function getCustomers(req, res) {
  return when(req.app.get('db').getCustomers())
    .then((response) => {
      return res.send({ statusCode: 200, message: response });
    })
    .catch((err) => {
      return res.send({ statusCode: 500, message: err.message });
    });
};
