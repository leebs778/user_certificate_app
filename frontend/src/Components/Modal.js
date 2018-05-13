import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/lib/Form';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';

class Modal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      password: '',
      email: '',
      error: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    return this.createCustomer(this.state.name, this.state.email, this.state.password)
      .then((result) => {
        if (result.statusCode === 400) {
          this.setState({ error: `${result.message} [${result.incorrectParams}]`});
        } else {
          this.props.onCreate({ id: result.resourceId, email: this.state.email, name: this.state.name });
          this.props.onClose();
          this.setState({ error: ``}); // clear out any lingering error msg
        }
      });
  }

  createCustomer = async (name, email, password) => {
    const response = await fetch(
      '/v1/customers/post', {
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          "name": name,
          "email": email,
          "password": password,
        }),
      }
    );
    return await response.json();
  };

  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }

    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      display: 'block',
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      padding: 30,
      margin: 'auto',
      height: '50%',
    };

    return (
      <div className="backdrop" style={backdropStyle}>
        <div className="modal" style={modalStyle}>
          <p style={{color: 'red'}}>{this.state.error}</p>
          <Form horizontal>
            <FormGroup controlId="formHorizontalName">
              <Col componentClass={ControlLabel} sm={2}>
                Name
              </Col>
              <Col sm={10}>
                <FormControl onChange={ e => this.setState({ name : e.target.value }) } type="text" placeholder="Name" />
              </Col>
            </FormGroup>
            <FormGroup controlId="formHorizontalEmail">
              <Col componentClass={ControlLabel} sm={2}>
                Email
              </Col>
              <Col sm={10}>
                <FormControl onChange={ e => this.setState({ email : e.target.value }) } type="email" placeholder="Email" />
              </Col>
            </FormGroup>

            <FormGroup controlId="formHorizontalPassword">
              <Col componentClass={ControlLabel} sm={2}>
                Password
              </Col>
              <Col sm={10}>
                <FormControl onChange={ e => this.setState({ password : e.target.value }) } type="password" placeholder="Password" />
              </Col>
            </FormGroup>
          </Form>
          <div className="footer">
            <Button onClick={this.props.onClose}> Close </Button>
            <Button onClick={this.handleSubmit}> Submit </Button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCreate: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;
