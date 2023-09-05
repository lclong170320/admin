import React from "react";
import * as customerApi from "../../api/customer";
import { useState, useEffect } from "react";
import LoadPage from "../../components/loadpage/Loadpage";
import { Link } from "react-router-dom";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import moment from "moment";
import CheckPagination from "../../components/Pagination/CheckPagination";

import { BiDetail } from "react-icons/bi";

function Customer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await customerApi.get("customers?limit=1000");
      setCustomers(data.customers);
      setLoading(false);
    };
    fetchAPI();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(7);
  // Get current
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = customers.slice(indexOfFirst, indexOfLast);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateNext = () => setCurrentPage(currentPage + 1);
  const paginatePrev = () => setCurrentPage(currentPage - 1);

  if (loading) return <LoadPage />;
  else
    return (
      <div className="data-table">
        <div className="data-table__heading">
          <span className="data-table__title">List customer</span>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Dob</td>
              <td>Email</td>
              <td>Phone</td>
              <td>Gmail</td>
              <td className="data-table__heading--manipulation">Thao tác</td>
            </tr>
          </thead>
          <tbody>
            {current.map((customer, index) => {
              return (
                <tr key={index}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.customer_name}</td>

                  <td>
                    {moment(customer.customer_dob).utc().format("DD-MM-YYYY")}
                  </td>
                  <td>Email</td>
                  <td>{customer.customer_phone}</td>
                  <td>{customer.customer_phone}</td>
                  <td>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Update</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Link
                          to={`/customers/customerDetail/${customer.customer_id}`}
                          className="link"
                        >
                          <Button
                            // className="data-table__heading--button"
                            variant="outline-warning"
                          >
                            <BiDetail />
                          </Button>
                        </Link>
                      </span>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <CheckPagination
          postsPerPage={perPage}
          totalPosts={customers.length}
          paginate={paginate}
          paginateNext={paginateNext}
          paginatePrev={paginatePrev}
        />
      </div>
    );
}

export default Customer;
