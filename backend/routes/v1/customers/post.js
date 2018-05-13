const when = require('when');
const validator = require('validator');

module.exports = function postCustomer(req, res) {

  const params = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
  };

  missingParams = [];
  _.mapKeys(params, (value, key) => {
    if (_.isNil(value) || _.isEmpty(value)) missingParams.push(key)
  });
  if (!_.isEmpty(missingParams)) return res.send({ statusCode: 400, message: 'Bad params - missing arg(s)', incorrectParams: `${missingParams}`});
  if (!validator.isEmail(params.email)) return res.send({ statusCode: 400, message: 'Invalid email provided', incorrectParams: 'email'});

  return when(req.app.get('db').createCustomer({
    email: params.email,
    name: params.name,
    plainTextPassword: params.password,
  }))
    .then((response) => {
      return res.send({ statusCode: 201, resourceId: response.insertId, message: 'User created' });
    })
    .catch((err) => {
      const errorResponse = { statusCode: 500, message: err.message };
      if (err.status === 'ER_DUP_ENTRY') errorResponse.statusCode = 400;
      return res.send(errorResponse);
    });
};
