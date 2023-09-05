import React from "react";
import * as productApi from "../../api/product";
import { useState, useEffect } from "react";
import LoadPage from "../../components/loadpage/Loadpage";
import { Link } from "react-router-dom";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";

import { BiDetail } from "react-icons/bi";
import { GrUpdate } from "react-icons/gr";
import {
  AiOutlineComment,
  AiOutlineSearch,
  AiTwotoneDelete,
} from "react-icons/ai";
import { TbDiscount2 } from "react-icons/tb";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckPagination from "../../components/Pagination/CheckPagination";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import * as categoryApi from "../../api/category";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteC, setDeletC] = useState(false);
  const [searchName, setSearchName] = useState();
  const [searchCategory, setSearchCategory] = useState();
  useEffect(() => {
    const fetchAPI = async () => {
      let data;
      if (searchName !== undefined) {
        data = await productApi.get(
          `products?product_name=${searchName}&?limit=500`
        );
      } else if (searchCategory !== undefined) {
        data = await productApi.get(
          `products?category_id=${searchCategory}&?limit=500`
        );
      } else {
        data = await productApi.get("products?limit=500");
      }
      setProducts(data.products);
      setLoading(false);
      setDeletC(false);
    };
    fetchAPI();
  }, [deleteC, searchName, searchCategory]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await categoryApi.get("category");
      setCategories(data.categories);
    };
    fetchAPI();
  }, []);

  const deleteProduct = (product_id) => {
    const agreeDelete = window.confirm(
      `Do you want to delete product: ${product_id} ??`
    );
    if (agreeDelete) {
      axios.delete(`http://localhost:3000/products/${product_id}`);
      toast.success("Delete product success");
      setDeletC(true);
    }
    return 0;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6);
  // Get current
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = products.slice(indexOfFirst, indexOfLast);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateNext = () => setCurrentPage(currentPage + 1);
  const paginatePrev = () => setCurrentPage(currentPage - 1);
  if (loading) return <LoadPage />;
  else
    return (
      <div className="data-table">
        <div className="data-table__heading">
          <span className="data-table__title">List products</span>

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

          <Form.Select
            onChange={(e) => setSearchCategory(e.target.value)}
            className="mt-2"
            size="sm"
            style={{ width: "20%" }}
          >
            {categories.map((category, index) => {
              return (
                <option key={index} value={category.category_id}>
                  {category.category_name}
                </option>
              );
            })}
          </Form.Select>
          <Link
            to="/products/create-product"
            style={{ textDecoration: "none" }}
            className="link"
          >
            <Button variant="outline-success">Add product</Button>
          </Link>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <td>id</td>
              <td>Name</td>
              <td>Category</td>
              <td>Price</td>
              <td>Storage</td>
              <td>Sold</td>
              <td>Comment</td>
              <td>Discount</td>
              <td style={{ width: "14%" }}></td>
            </tr>
          </thead>
          <tbody>
            {current.map((product, index) => {
              return (
                <tr key={index}>
                  <td>{product.product_id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.category.category_name}</td>
                  <td>
                    {product.product_price.toLocaleString("vi", {
                      style: "currency",
                      currency: "VND",
                    })}{" "}
                  </td>
                  <td>{product.storage.product_quantity}</td>
                  <td>{product.storage.product_sold}</td>
                  <td style={{ textAlign: "center" }}>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">comment</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Link
                          to={`/products/${product.product_id}/comment`}
                          className="link"
                        >
                          <Button
                            className="data-table__heading--button"
                            variant="outline-info"
                          >
                            <AiOutlineComment />
                          </Button>
                        </Link>
                      </span>
                    </OverlayTrigger>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-disabled">discount</Tooltip>
                      }
                    >
                      <span className="d-inline-block">
                        <Link
                          to={`/discounts/createDiscount/${product.product_id}`}
                          className="link"
                        >
                          <Button
                            className="data-table__heading--button"
                            variant="outline-success"
                          >
                            <TbDiscount2 />
                          </Button>
                        </Link>
                      </span>
                    </OverlayTrigger>
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Detail</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Link
                          to={`/products/detailProduct/${product.product_id}`}
                          className="link"
                        >
                          <Button
                            className="data-table__heading--button"
                            variant="outline-success"
                          >
                            <BiDetail />
                          </Button>
                        </Link>
                      </span>
                    </OverlayTrigger>

                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Update</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Link
                          to={`/products/update-product/${product.product_id}`}
                          className="link"
                        >
                          <Button
                            style={{ marginLeft: "8px" }}
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
                      <Button
                        className="data-table__heading--button"
                        style={{ float: "right" }}
                        variant="outline-danger"
                        onClick={() => deleteProduct(product.product_id)}
                      >
                        <AiTwotoneDelete />
                      </Button>
                    </OverlayTrigger>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        {products.length > 6 ? (
          <CheckPagination
            postsPerPage={perPage}
            totalPosts={products.length}
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

export default Products;
