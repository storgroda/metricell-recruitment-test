import { useEffect, useState } from 'react';
import DataTable from 'datatables.net-react';
import DT from 'datatables.net-bs5';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

DataTable.use(DT);

function GroupResultsDataTable() {
    const [tableData, setTableData] = useState <Array<[string, bigint]>>([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);

    useEffect(() => {
        getTableData();
    }, []);

    async function getTableData() {
        axios.get('api/list')
            .then(response => {
                setLoading(false);
                setTableData(response.data);
            }, error => {
                setLoadingError(true);
            });
    }

    if (loading) return <Container className="mt-4 p-3 text-center"><div><Spinner animation="border" variant="primary" /></div></Container>;
    if (loadingError) return <Container className="p-3 text-center"><div>An error has occured</div></Container>;

    return (
        <>
            <Container className="p-3">
                <h1>Employee Groupings</h1>
                <DataTable
                    data={tableData}
                    columns={[{ data: 'key' }, { data: 'total' }]}
                    className="display">
                    <thead>
                        <tr>
                            <th>Initial</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                </DataTable>
            </Container>
        </>
    );
}

export default GroupResultsDataTable;
