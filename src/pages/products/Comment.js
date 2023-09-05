import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import * as productApi from "../../api/product";
import Table from "react-bootstrap/Table";
import CheckPagination from "../../components/Pagination/CheckPagination";
import LoadPage from "../../components/loadpage/Loadpage";
import { AiFillStar, AiOutlineSearch, AiTwotoneDelete } from "react-icons/ai";
import { IoReturnDownBack } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  Button,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

function Comment() {
  //get product
  const { product_id } = useParams();
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState([]);
  const [deleteC, setDeletC] = useState(false);
  const [search, setSearch] = useState();
  const [searchCustomer, setSearchCustomer] = useState();
  useEffect(() => {
    const fetchAPI = async () => {
      const data = await productApi.get(`product?product_id=${product_id}`);
      setProduct(data.products[0]);
      setLoading(false);
    };
    fetchAPI();
  }, [product_id]);
  useEffect(() => {
    const fetchAPI = async () => {
      let data;
      if (search !== undefined) {
        data = await productApi.get(
          `comments??product_id=${product_id}&comment_content=${search}&?limit=999`
        );
      } else if (searchCustomer !== undefined) {
        data = await productApi.get(
          `comments?product_id=${product_id}&customer_name=${searchCustomer}&?limit=999`
        );
      } else {
        data = await productApi.get(
          `comments?product_id=${product_id}&limit=999`
        );
      }
      setCommentList(data.comments);
      setLoading(false);
      setDeletC(false);
    };
    fetchAPI();
  }, [product_id, deleteC, search, searchCustomer]);

  const deleteComment = (comment_id) => {
    const agreeDelete = window.confirm(
      `Do you want to delete comment: ${comment_id} ??`
    );
    if (agreeDelete) {
      axios.delete(`http://localhost:3000/comments/${comment_id}`);
      toast.success("Delete comment success");
      setDeletC(true);
    }
    return 0;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6);
  // Get current
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = commentList.slice(indexOfFirst, indexOfLast);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateNext = () => setCurrentPage(currentPage + 1);
  const paginatePrev = () => setCurrentPage(currentPage - 1);
  if (loading) return <LoadPage />;
  else
    return (
      <div className="new-container">
        <div className="new-container-top">
          <span
            className="new-container-top__title"
            style={{
              width: "170%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Comment {product.product_name}</span>
            <InputGroup
              onChange={(e) => setSearch(e.target.value)}
              size="sm"
              className="mt-1"
              style={{ width: "15%", height: "50%" }}
            >
              <Form.Control
                placeholder="Search content"
                aria-describedby="basic-addon2"
              />
              <Button variant="outline-secondary" id="button-addon2">
                <AiOutlineSearch size={25} />
              </Button>
            </InputGroup>
            <InputGroup
              onChange={(e) => setSearchCustomer(e.target.value)}
              size="sm"
              className="mt-1"
              style={{ width: "15%", height: "50%" }}
            >
              <Form.Control
                placeholder="Search customer"
                aria-describedby="basic-addon2"
              />
              <Button variant="outline-secondary" id="button-addon2">
                <AiOutlineSearch size={25} />
              </Button>
            </InputGroup>
          </span>
        </div>
        <div className="new-container-bottom">
          <Table hover>
            <thead>
              <tr>
                <th>STT</th>
                <th>Content</th>
                <th>Start</th>
                <th>Customer</th>
                <th>Created At</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {current.map((comment, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{comment.comment_content}</td>
                    <td>
                      {comment.comment_star}{" "}
                      <AiFillStar size={24} color={"yellow"} />
                    </td>
                    <td>{comment.customer?.customer_name}</td>
                    <td style={{ width: "200px" }}>
                      {moment(comment.createdAt)
                        .utc()
                        .format("DD-MM-YYYY H:mm:ss")}
                    </td>
                    <td style={{ width: "80px" }}>
                      {" "}
                      <OverlayTrigger
                        placement="bottom"
                        overlay={
                          <Tooltip id="tooltip-disabled">Delete</Tooltip>
                        }
                      >
                        <Button
                          className="data-table__heading--button"
                          style={{ float: "right" }}
                          variant="outline-danger"
                          onClick={() => deleteComment(comment.comment_id)}
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
          {commentList.length > 6 ? (
            <CheckPagination
              postsPerPage={perPage}
              totalPosts={commentList.length}
              paginate={paginate}
              paginateNext={paginateNext}
              paginatePrev={paginatePrev}
            />
          ) : (
            <></>
          )}
          <ToastContainer />
        </div>
        <div style={{ margin: "auto", width: "50%", textAlign: "center" }}>
          <Link to={`/products`} className="link">
            <Button variant="primary" size="sm">
              Quay lại&nbsp;
              <IoReturnDownBack />
            </Button>
          </Link>
        </div>
      </div>
    );
}

export default Comment;
