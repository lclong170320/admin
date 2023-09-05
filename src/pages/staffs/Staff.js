import React from "react";
import * as customerApi from "../../api/customer";
import { useState, useEffect } from "react";
import LoadPage from "../../components/loadpage/Loadpage";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  InputGroup,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import moment from "moment";
import CheckPagination from "../../components/Pagination/CheckPagination";

import { BiDetail } from "react-icons/bi";
import { AiOutlineSearch, AiTwotoneDelete } from "react-icons/ai";
import { MdOutlineChangeCircle } from "react-icons/md";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function Staff() {
  const [staffs, setStaffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState();
  const [deleteC, setDeleteC] = useState(false);
  useEffect(() => {
    const fetchAPI = async () => {
      let data = [];
      if (searchName !== undefined) {
        data = await customerApi.get(
          `staffs?staff_name=${searchName}&?limit=1000`
        );
      } else {
        data = await customerApi.get("staffs");
      }
      setStaffs(data.staffs);
      setLoading(false);
      setDeleteC(false);
    };
    fetchAPI();
  }, [searchName, loading, deleteC]);

  const deleteStaff = (staff_id) => {
    const agreeDelete = window.confirm(`Do you want to delete staff not ??`);
    if (agreeDelete) {
      axios.delete(`http://localhost:3000/staffs/${staff_id}`);
      toast.success("Delete staff successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setDeleteC(true);
    }
    return 0;
  };

  const changePassword = (staff_id) => {
    const agreeDelete = window.confirm(`Do you want to change password not ??`);
    if (agreeDelete) {
      axios.put(
        `http://localhost:3000/staffs/changePassword/${staff_id}`,
        {
          password: "1",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Change password successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setDeleteC(true);
    }
    return 0;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);
  // Get current
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = staffs.slice(indexOfFirst, indexOfLast);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateNext = () => setCurrentPage(currentPage + 1);
  const paginatePrev = () => setCurrentPage(currentPage - 1);

  if (loading) return <LoadPage />;
  else
    return (
      <div className="data-table">
        <div className="data-table__heading">
          <span className="data-table__title">Staff</span>
          <InputGroup
            onChange={(e) => setSearchName(e.target.value)}
            size="sm"
            className="mt-1"
            style={{ width: "30%", height: "70%" }}
          >
            <Form.Control
              placeholder="Search staff by name"
              aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2">
              <AiOutlineSearch size={25} />
            </Button>
          </InputGroup>
          <Link
            to="/staffs/createStaff/"
            style={{ textDecoration: "none" }}
            className="link"
          >
            <Button variant="outline-success">Add staff</Button>
          </Link>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Dob</td>
              <td>Phone</td>
              <td>Gmail</td>
              <td>Type</td>
              <td>Address</td>
              <td style={{ width: "170px" }}></td>
            </tr>
          </thead>
          <tbody>
            {current.map((staff, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{staff.staff_name}</td>

                  <td>{moment(staff.staff_dob).utc().format("DD-MM-YYYY")}</td>
                  <td>{staff.staff_phone}</td>
                  <td>{staff.staff_gmail}</td>
                  <td>
                    {staff.staff_type === false ? (
                      "staff"
                    ) : (
                      <span style={{ color: "red" }}> Admin </span>
                    )}
                  </td>
                  <td>{staff.staff_address}</td>
                  <td>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-disabled">
                          change the password to 1
                        </Tooltip>
                      }
                    >
                      <span className="d-inline-block">
                        <Button
                          onClick={() => changePassword(staff.staff_id)}
                          variant="outline-primary"
                        >
                          <MdOutlineChangeCircle />
                        </Button>
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Update</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Link
                          to={`/staffs/update-staff/${staff.staff_id}`}
                          className="link"
                        >
                          <Button
                            style={{ marginLeft: "10px" }}
                            variant="outline-warning"
                          >
                            <BiDetail />
                          </Button>
                        </Link>
                      </span>
                    </OverlayTrigger>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Delete</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Button
                          style={{ marginLeft: "10px" }}
                          variant="outline-danger"
                          onClick={() => deleteStaff(staff.staff_id)}
                        >
                          <AiTwotoneDelete />
                        </Button>
                      </span>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <ToastContainer />
        {staffs.length > 7 ? (
          <CheckPagination
            postsPerPage={perPage}
            totalPosts={staffs.length}
            paginate={paginate}
            paginateNext={paginateNext}
            paginatePrev={paginatePrev}
          />
        ) : (
          ""
        )}
      </div>
    );
}

export default Staff;
