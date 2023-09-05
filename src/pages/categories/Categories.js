import React from "react";
import * as categoryApi from "../../api/category";
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

import { GrUpdate } from "react-icons/gr";
import { AiOutlineSearch, AiTwotoneDelete } from "react-icons/ai";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import CheckPagination from "../../components/Pagination/CheckPagination";
import moment from "moment/moment";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteC, setDeletC] = useState(false);
  const [searchName, setSearchName] = useState();
  useEffect(() => {
    const fetchAPI = async () => {
      let data;
      if (searchName !== undefined) {
        data = await categoryApi.get(
          `categories?category_name=${searchName}&?limit=100`
        );
      } else {
        data = await categoryApi.get("categories?limit=100");
      }
      setCategories(data.categories);
      setLoading(false);
      setDeletC(false);
    };
    fetchAPI();
  }, [deleteC, searchName]);

  const deleteCategory = (category_id) => {
    const agreeDelete = window.confirm(
      `Do you want to delete category id Do you want to delete staff not ??`
    );
    if (agreeDelete) {
      axios.delete(`http://localhost:3000/categories/${category_id}`);
      toast.success("Delete category successfully", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
      });
      setDeletC(true);
    }
    return 0;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(5);
  // Get current
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = categories.slice(indexOfFirst, indexOfLast);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateNext = () => setCurrentPage(currentPage + 1);
  const paginatePrev = () => setCurrentPage(currentPage - 1);

  if (loading) return <LoadPage />;
  else
    return (
      <div className="data-table">
        <div className="data-table__heading">
          <span className="data-table__title">List Categories</span>

          <InputGroup
            onChange={(e) => setSearchName(e.target.value)}
            size="sm"
            className="mt-1"
            style={{ width: "30%", height: "70%" }}
          >
            <Form.Control
              placeholder="Search product by name"
              aria-describedby="basic-addon2"
            />
            <Button variant="outline-secondary" id="button-addon2">
              <AiOutlineSearch size={25} />
            </Button>
          </InputGroup>
          <Link
            to="/categories/create-category"
            style={{ textDecoration: "none" }}
            className="link"
          >
            <Button variant="outline-success">Add categories</Button>
          </Link>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <td>id</td>
              <td>Name</td>
              <td>img</td>
              <td>Created_at</td>
              <td>Updated_at</td>
              <td className="data-table__heading--manipulation"></td>
            </tr>
          </thead>
          <tbody>
            {current.map((category, index) => {
              return (
                <tr key={index}>
                  <td>{category.category_id}</td>
                  <td>{category.category_name}</td>
                  <td style={{ width: "120px", height: "84px" }}>
                    <img
                      className="data-table__heading--img"
                      src={`http://127.0.0.1:8081//${category.category_img}`}
                      alt="Lỗi"
                    />
                  </td>
                  <td>
                    {moment(category.createdAt)
                      .utc()
                      .format("DD-MM-YYYY H:mm:ss")}
                  </td>
                  <td>
                    {moment(category.updatedAt)
                      .utc()
                      .format("DD-MM-YYYY H:mm:ss")}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Update</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Link
                          to={`/categories/update-category/${category.category_id}`}
                          className="link"
                        >
                          <Button
                            className="data-table__heading--button"
                            variant="outline-warning"
                          >
                            <GrUpdate />
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
                          className="data-table__heading--button"
                          style={{ marginLeft: "10px" }}
                          variant="outline-danger"
                          onClick={() => deleteCategory(category.category_id)}
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
        {categories.length > 6 ? (
          <CheckPagination
            postsPerPage={perPage}
            totalPosts={categories.length}
            paginate={paginate}
            paginateNext={paginateNext}
            paginatePrev={paginatePrev}
          />
        ) : (
          <></>
        )}
      </div>
    );
}

export default Categories;
