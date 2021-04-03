/* eslint-disable react/prop-types */
import React from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropDown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import IssueAddNavItem from "./IssueAddNavItem.jsx";
import Search from "./Search.jsx";
import SignInNavItem from "./SignInNavItem.jsx";

export default function Header(props) {
  const { user, onChangeUser } = props;
  return (
    <Navbar collapseOnSelect expand="lg" className="justify-content-between">
      <Navbar.Brand>Issue Tracker</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav">
        <FontAwesomeIcon icon={faBars} />
      </Navbar.Toggle>
      <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-between">
        <Nav variant="dark" className="mr-auto">
          <Nav.Item>
            <NavLink className="nav-link" to="/" exact>Home</NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/issues" className="nav-link">Issues</NavLink>
          </Nav.Item>
          <Nav.Item>
            <NavLink to="/report" className="nav-link">Report</NavLink>
          </Nav.Item>
        </Nav>
        <Col sm={5} className="mr-3">
          <Search />
        </Col>
        <Nav className="mr-3">
          <IssueAddNavItem user={user} />
        </Nav>
        <Nav className="mr-3">
          <SignInNavItem user={user} onChangeUser={onChangeUser} />
        </Nav>
        <Nav className="mr-3">
          <NavDropDown
            id="second-navigation-dropdown"
            title={<FontAwesomeIcon icon={faEllipsisV} />}
            drop="left"
          >
            <NavDropDown.Item as="div">
              <NavLink className="nav-link" to="/about">About</NavLink>
            </NavDropDown.Item>
            <NavDropDown.Divider />
            <NavDropDown.ItemText>Sample</NavDropDown.ItemText>
          </NavDropDown>
          <Nav.Item />
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
