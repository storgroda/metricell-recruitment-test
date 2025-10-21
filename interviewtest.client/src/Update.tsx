import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import axios from 'axios';

function Update({ id, onCancel, onSuccess }) {
    const [employeeId, setEmployeeId] = useState(id);
    const [employeeName, setEmployeeName] = useState('');
    const [employeeValue, setEmployeeValue] = useState(0);
    const [message, setMessage] = useState('');

    useEffect(() => {
        getFormData();
    }, []);

    const getFormData = async () => {
        await axios.get(`api/employees/${employeeId}`)
            .then(response => {
                setEmployeeName(response.data.name);
                setEmployeeValue(response.data.value);
                setMessage('');
            }, error => {
                setMessage('Error');
            });
    }

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

    const validateValue = (val) => {
        if (val == null || val === '') {
            return 'Value: Value is required';
        }
        const re = /^[0-9]+$/;
        if (!re.test(val)) {
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

        let msg = validateForm();
        if (msg != null) {
            setMessage(msg);
            return;
        } else {
            await axios.put(`api/employees/${employeeId}`, { rowId: employeeId, name: employeeName, value: employeeValue })
                .then(response => {
                    onSuccess();
                }, error => {
                    setMessage('Error');
                });
        }
    }

    return (
        <Container className="p-3">
            <h1>Update Employee</h1>
            <Form>
                <input type="hidden" id="" name="" value="" />
                <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>Employee Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter name" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formValue">
                    <Form.Label>Value</Form.Label>
                    <Form.Control type="text" placeholder="Value" value={employeeValue} onChange={(e) => setEmployeeValue(e.target.value)} />
                    <Form.Text className="text-muted">
                        Numeric values only
                    </Form.Text>
                </Form.Group>

                {message && <Alert variant="warning">{message}</Alert>}

                <Button variant="danger" onClick={onCancel} >
                    Cancel
                </Button>

                <Button className="mx-1" variant="primary" type="submit" onClick={postData}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Update;