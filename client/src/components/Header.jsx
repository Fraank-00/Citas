import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Navbar, Nav, Form, FormControl } from 'react-bootstrap';

function Header({ user, onLogout, onSearch }) {

 
    return (
        <Navbar bg="primary" data-bs-theme="dark">
            <Navbar.Brand as={Link} to="/">Reservas-Citas  App</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    {user ? (
                        <>
                            <Nav.Link as={Link} to="/services">Servicios</Nav.Link>
                            <Nav.Link as={Link} to="/reservas">Reservas</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                        </>
                    )}
                </Nav>

               

                {user && (
                    <div className="d-flex align-items-center">
                        <Button variant="outline-light" onClick={onLogout} className="ms-3">Cerrar Sesión</Button>
                    </div>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
}

export default Header;
