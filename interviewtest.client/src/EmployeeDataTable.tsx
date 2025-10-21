import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

DataTable.use(DT);

function EmployeeDataTable({ onUpdate, onCreate, onLoading, onLoad }) {

    const [tableData, setTableData] = useState <Array<[bigint, string, bigint]>>([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);

    useEffect(() => {
        getTableData();
    }, []);

    async function getTableData() {
        axios.get('api/employees')
            .then(response => {
                setLoading(false);
                setTableData(response.data);
            }, error => {
                setLoadingError(true);
            });
    }

    async function IncrementValues() {
        onLoading();
        axios.post('api/list')
            .then(response => {
                setLoading(true);
                getTableData();
                onLoad();
            }, error => {
            });
    }

    async function AddItem() {
        onCreate();
    }

    async function EditItem(id) {
        onUpdate(id);
    }

    async function DeleteItem(id) {
        axios.delete(`api/employees/${id}`)
            .then(() => {
                getTableData();
            });
    }

    if (loading) return <Container className="mt-4 p-3 text-center"><div><Spinner animation="border" variant="primary" /></div></Container>;
    if (loadingError) return <Container className="p-3 text-center"><div>An error has occured</div></Container>;

    return (
        <>
            <Container className="p-3">
                <h1>Employees</h1>
                <Button variant="success" onClick={() => AddItem()}>
                    Add Employee
                </Button>
                <Button className="mx-1" variant="warning" onClick={() => IncrementValues()}>
                    Increment Employee Values
                </Button>
                <DataTable
                    data={tableData}
                    columns={[{ data: 'rowId' }, { data: 'name' }, { data: 'value' }]}
                    slots={{
                        3: (data, row) => (
                            <>
                                <Button className="mx-1" variant="primary" onClick={() => EditItem(row.rowId)}>
                                    Amend
                                </Button>
                                <Button className="mx-1" variant="danger" onClick={() => DeleteItem(row.rowId)}>
                                    Delete
                                </Button>
                            </>
                        )
                    }}
                    className="display">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Name</th>
                            <th>Value</th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                </DataTable>
            </Container>
        </>
    );
}

export default EmployeeDataTable;
