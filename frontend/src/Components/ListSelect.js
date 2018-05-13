import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ToggleButtonGroup from 'react-bootstrap/lib/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/lib/ToggleButton';
import Col from 'react-bootstrap/lib/Col';
import Modal from './Modal';

import findIndex from 'lodash/findIndex';

class ListSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customers: [],
      isOpen: false,
      selectedCustomerIndex: -1,
      hasClickedCustomer: false,
      certificates: [],
      selectedCertificate: false,
      selectedCertificateIndex: -1,
    };
  }

  addCustomer = (customer) => {
    const customers = this.state.customers;
    customers.push(customer);
    this.setState({ customers })
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  deleteCustomer = async () => {
    if (!this.state.hasClickedCustomer) return;
    const idOfCustomerSelected = this.state.customers[this.state.selectedCustomerIndex].id;
    const response = await fetch(
      `/v1/customers/${idOfCustomerSelected}/delete`,
      { method: 'delete' }
    );
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    const customers = this.state.customers;
    customers.splice(this.state.selectedCustomerIndex, 1);
    this.setState({ customers, hasClickedCustomer: false, selectedCustomerIndex: -1, certificates: []});
    return body;
  }

  getCustomers = async () => {
    const response = await fetch('/v1/customers/get');
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  getCertificates = async (index) => {
    const idOfCustomerSelected = this.state.customers[index].id;
    const response = await fetch(`/v1/customers/${idOfCustomerSelected}/certificates/get`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    return body;
  }

  createCert = async () => {
    if (this.state.selectedCustomerIndex === -1) return; // don't create a certificate for a nonexistant user
    const idOfCustomerSelected = this.state.customers[this.state.selectedCustomerIndex].id;
    const response = await fetch('/v1/certificates/post', {
      method: 'post',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        "customer_id": idOfCustomerSelected,
      }),
    });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    const certificates = this.state.certificates;
    certificates.push({ id: body.resourceId, active: false });
    this.setState({ certificates });
    return body;
  }

  activateCertificate = async () => {
    const idOfCertificateSelected = this.state.certificates[this.state.selectedCertificateIndex].id;
    const response = await fetch(`/v1/certificates/${idOfCertificateSelected}/activate/put`, { method: 'put' });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    const certificates = this.state.certificates;
    const certificateStateIndex = findIndex(certificates, { id: idOfCertificateSelected });
    certificates[certificateStateIndex].active = true;
    this.setState({ certificates });
    return body;
  }

  deactivateCertificate = async () => {
    const idOfCertificateSelected = this.state.certificates[this.state.selectedCertificateIndex].id;
    const response = await fetch(`/v1/certificates/${idOfCertificateSelected}/deactivate/put`, { method: 'put' });
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    const certificates = this.state.certificates;
    const certificateStateIndex = findIndex(certificates, { id: idOfCertificateSelected });
    certificates[certificateStateIndex].active = false;
    this.setState({ certificates });
    return body;
  }

  isCustomerSelect() {
    return
  }

  componentDidMount() {
    this.getCustomers()
      .then(res => this.setState({ customers: res.message }))
      .catch(err => console.log(err));
  }

  handleCustomerClick(index) {
    this.setState({
      selectedCustomerIndex: index,
      hasClickedCustomer: true,
      selectedCertificate: false,
      selectedCertificateIndex: -1,
      certificates: [],
    })
    // Set loading
    this.getCertificates(index)
      .then(res => {
        this.setState({ certificates: res.message.items })
      })
      .catch(err => console.log(err));
  }

  handleCertificateClick(index) {
    this.setState({
      selectedCertificate: true,
      selectedCertificateIndex: index,
    });
  }

  render() {
    const marginLeft = {'marginLeft': '8%'};
    return (
      <div>
        <h1 style={{'textAlign': 'center'}}>User / Certificate Management Miniapp</h1>

        {/* Users */}
        <Col md={4} mdPush={6}>
          <h3>Users</h3>
          <h6 id="UserColHeader" style={marginLeft}>{'ID, Customer Name, Customer Email '}</h6>
          <ButtonToolbar>
            <Col sm={4}>
              <ToggleButtonGroup type="radio" name="users" style={{display: 'block'}}>
              { this.state.customers.map(
                (customer, index) =>
                  <ToggleButton onClick={this.handleCustomerClick.bind(this, index)} value={index}>
                    {' ' + customer.id + ', ' + customer.name + ', ' + customer.email}
                  </ToggleButton>
              )}
              </ToggleButtonGroup>
            </Col>
          </ButtonToolbar>

          <ButtonGroup bsSize="large">
            <Button onClick={this.toggleModal}> + </Button>
            <Button onClick={this.deleteCustomer} disabled={this.state.selectedCustomerIndex === -1}> - </Button>
          </ButtonGroup>
        </Col>

        {/* Certificates */}
        <Col md={4} mdPull={6}>
          <h3>Certificates</h3>
          <h6 id="UserCertHeader" style={marginLeft}>{'ID, Active'}</h6>
          <ButtonToolbar>
            <Col sm={4}>
              <ToggleButtonGroup type="radio" name="certs" style={{display: 'block'}}>
              { this.state.certificates.map(
                (certificate, index) => {
                  return <ToggleButton onClick={this.handleCertificateClick.bind(this, index)} value={index}>{' ' + certificate.id + ', ' + certificate.active}</ToggleButton>
                }
              )}
              </ToggleButtonGroup>
            </Col>
          </ButtonToolbar>
          <p id="certFooter" style={marginLeft}>{this.state.certificates.length + ' Certificates(s)'}</p>
          <ButtonGroup bsSize="large">
            <Button onClick={this.createCert} disabled={this.state.selectedCustomerIndex === -1}> + </Button>
            <Button onClick={this.activateCertificate} disabled={!this.state.selectedCertificate} style={{color: 'green'}}> Activate </Button>
            <Button onClick={this.deactivateCertificate} disabled={!this.state.selectedCertificate} style={{color: 'red'}}> Deactivate </Button>
          </ButtonGroup>
        </Col>

        <Modal show={this.state.isOpen} onClose={this.toggleModal} onCreate={this.addCustomer}>
          Add a Customer
        </Modal>
      </div>
    )
  }
}

export default ListSelect;
