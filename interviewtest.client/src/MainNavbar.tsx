import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

function MainNavbar() {
    return (
        <>
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src="./vite.svg"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Main Navbar
                    </Navbar.Brand>
                </Container>
            </Navbar>
        </>
    );
}

export default MainNavbar;