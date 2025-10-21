import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert';

function Create({ onCancel, onSuccess }) {
    const [employeeName, setEmployeeName] = useState('');
    const [employeeValue, setEmployeeValue] = useState('');
    const [message, setMessage] = useState('');

    // TODO: Upgrade validation to React Hook Form  
    const validateName = (name) => {
        if (name.trim() === '') {
            return 'Name is required';
        }
        const re = /^[a-z-' ]+$/;
        if (!re.test(String(name).toLowerCase())) {
            return 'Please enter valid characters only';
        }
        return null;
    }

    const validateValue = (value) => {
        if (value.trim() === '') {
            return 'Value: Value is required';
        }
        const re = /^[0-9]+$/;
        if (!re.test(value)) {
            return 'Please enter a number';
        }
        return null;
    }

    const validateForm = () => {
        let msg = null;
        msg = validateName(employeeName);
        if (msg == null) msg = validateValue(employeeValue);
        return msg;
    }

    const postData = async (e) => {
        e.preventDefault();
        setMessage('');

        let msg = validateForm();
        if (msg != null) {
            setMessage(msg);
            return;
        } else {
            await axios.post('api/employees', { rowId: 0, name: employeeName, value: employeeValue })
                .then(response => {
                    onSuccess();
                }, error => {
                    setMessage('Error');
                });
        }
    }

    return (
        <Container className="p-3">
            <h1>Create Employee</h1>

            <Form>
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Employee Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" onChange={(e) => setEmployeeName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formValue">
                    <Form.Label>Value</Form.Label>
                    <Form.Control type="text" placeholder="Value" onChange={(e) => setEmployeeValue(e.target.value)} />
                    <Form.Text className="text-muted">
                        Numeric values only
                    </Form.Text>
                </Form.Group>
                {message && <Alert variant="warning">{message}</Alert>}

                <Button variant="danger" onClick={onCancel} >
                    Cancel
                </Button>

                <Button className="mx-1" variant="primary" type="submit" onClick={postData} >
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Create;