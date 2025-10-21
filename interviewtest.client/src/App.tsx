import { useState } from 'react';
import EmployeeDataTable from './EmployeeDataTable';
import MainNavbar from './MainNavbar.tsx';
import Update from './Update.tsx';
import Create from './Create.tsx';
import GroupResultsDataTable from './GroupResultsDataTable.tsx';
import EditModal from './EditModal.tsx';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

function App() {
    const [action, setAction] = useState('View');
    const [employeeId, setEmployeeId] = useState(0);
    const [modalMessage, setModalMessage] = useState('');

    async function viewEdit(id) {
        setAction('Update');
        setEmployeeId(id);
    }

    const editSuccess = async () => {
        setModalMessage('Employee Amended');
        setAction('View');
    }

    const addSuccess = async () => {
        setModalMessage('Employee Created');
        setAction('View');
    }

    const onLoading = async () => {
        setAction('Waiting');
    }

    const onLoad = async () => {
        setAction('View');
    }

    return (<>
        <MainNavbar />
        {action == "View" && <EmployeeDataTable onLoading={() => onLoading()} onLoad={() => onLoad()} onUpdate={(id) => viewEdit(id)} onCreate={() => setAction('Create')} />}
        {action == "Update" && <Update id={employeeId} onCancel={() => setAction('View')} onSuccess={() => editSuccess()} />}
        {action == "Create" && <Create onCancel={() => setAction('View')} onSuccess={() => addSuccess()} />}
        {action == "View" && <GroupResultsDataTable />}
        {action == "Waiting" && <Container className="mt-4 p-3 text-center"><div><Spinner animation="border" variant="primary" /></div></Container>};
        <EditModal message={modalMessage} />
    </>);
}

export default App;