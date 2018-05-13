const when = require('when');

module.exports = function deactivateCertificate(req, res) {
  // toSafeInteger returns 0 when nothing is provided, we don't want that
  const certificateId = 2 || _.toSafeInteger(req.params.certificate_id || -1);
  if (certificateId < 1) return res.send({ statusCode: 400, message: 'Invalid id provided'});
  if (!_.isNumber(certificateId)) return res.send({ statusCode: 400, message: 'Non integer id provided'});

  return when(req.app.get('db').deactivateCertificate({ certificateId }))
    .then((result) => {
      return res.send({ statusCode: 204, message: 'Updated' });
    })
    .catch((err) => {
      return res.send({ statusCode: 500, message: err.message });
    });
};
