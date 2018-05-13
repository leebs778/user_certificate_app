const bcrypt = require('bcrypt');
const mysql = require('mysql');
const when = require('when');

function getConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
  });
}

function createCustomer({ email, name, plainTextPassword }) {
  const saltRounds = 10;
  // hash user password
  return when(bcrypt.hash(plainTextPassword, saltRounds))
    .then(function(hashedPassword) {
      const query = mysql.format('INSERT INTO customers (email, name, password) values (?, ?, ?)', [email, name, hashedPassword]);
      return executeQuery(query)
        .then((result) => {
          return when.resolve(result);
        })
        .catch((err) => {
          if (err.code === 'ER_DUP_ENTRY') return when.reject({ status: 'ER_DUP_ENTRY', message: 'That email already exists'});
          return when.reject({ status: 'Internal DB Error' });
        });
    });
}

function getCustomers() {
  const query = "Select id, name, email FROM customers"
  return executeQuery(query)
    .then((result) => {
      return when.resolve(result);
    })
    .catch((err) => {
      return when.reject({ status: 'Internal DB Error' });
    });
}

function getCustomerById({ customerId }) {
  const query = mysql.format('SELECT * FROM customers where id = ?', [customerId]);
  return executeQuery(query)
    .then((result) => {
      return when.resolve(result);
    })
    .catch((err) => {
      return when.reject({ status: 'Internal DB Error' });
    });
}

function deleteCustomerById({ customerId }) {
  const query = mysql.format('DELETE FROM customers WHERE id = ?', [customerId]);
  return executeQuery(query)
    .then((result) => {
      return when.resolve(result);
    })
    .catch((err) => {
      return when.reject({ status: 'Internal DB Error' });
    });
}

function createCertificate({ customerId, privateKey, body }) {
  const connection = getConnection();
  return new Promise((resolve, reject) => {
    // utilizes alternate query syntax because of privateKey and certificateBody escaping
    connection.query('INSERT INTO certificates SET ?', { customer_id: customerId, private_key: privateKey, certificate_body: body }, function(err, result, fields) {
      connection.end();
      return err ? reject(err) : resolve(result);
    });
  });
}

function deleteCertificatesByCustomerId({ customerId }) {
  const query = mysql.format('DELETE FROM certificates WHERE customer_id = ?', [customerId]);
  return executeQuery(query)
    .then((result) => {
      return when.resolve(result);
    })
    .catch((err) => {
      return when.reject({ status: 'Internal DB Error' });
    });
}

function deleteCertificatesByCustomerId({ customerId }) {
  const query = mysql.format('DELETE FROM certificates WHERE customer_id = ?', [customerId]);
  return executeQuery(query)
    .then((result) => {
      return when.resolve(result);
    })
    .catch((err) => {
      return when.reject({ status: 'Internal DB Error' });
    });
}

function getCertificatesByCustomerId({ customerId }) {
  const query = mysql.format('SELECT id, active FROM certificates WHERE customer_id = ?', [customerId]);
  return executeQuery(query)
    .then((result) => {
      return when.resolve(result);
    })
    .catch((err) => {
      return when.reject({ status: 'Internal DB Error' });
    });
}

function activateCertificate({ certificateId }) {
  const query = mysql.format('UPDATE certificates SET active = 1 where id = ?', [certificateId]);
  return executeQuery(query)
    .then((result) => {
      return when.resolve(result);
    })
    .catch((err) => {
      return when.reject({ status: 'Internal DB Error' });
    });
}

function deactivateCertificate({ certificateId }) {
  const query = mysql.format('UPDATE certificates SET active = 0 where id = ?', [certificateId]);
  return executeQuery(query)
    .then((result) => {
      return when.resolve(result);
    })
    .catch((err) => {
      return when.reject({ status: 'Internal DB Error' });
    });
}

function executeQuery(query) {
  const connection = getConnection();
  return new Promise((resolve, reject) => {
    connection.query(query, function(err, result, fields) {
      connection.end();
      return err ? reject(err) : resolve(result);
    });
  });
}

module.exports = {
  getCustomers,
  createCustomer,
  deleteCustomerById,
  getCustomerById,
  createCertificate,
  deleteCertificatesByCustomerId,
  getCertificatesByCustomerId,
  activateCertificate,
  deactivateCertificate,
};
