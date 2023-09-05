import React from "react";
import * as discountApi from "../../api/discount";
import { useState, useEffect } from "react";
import LoadPage from "../../components/loadpage/Loadpage";
import { Link } from "react-router-dom";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";

import { GrUpdate } from "react-icons/gr";
import { AiTwotoneDelete } from "react-icons/ai";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import CheckPagination from "../../components/Pagination/CheckPagination";

function Discounts() {
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteC, setDeletC] = useState(false);

  useEffect(() => {
    const fetchAPI = async () => {
      const data = await discountApi.get("discounts?limit=1000");
      setDiscounts(data.discounts);
      setLoading(false);
      setDeletC(false);
    };
    fetchAPI();
  }, [deleteC]);

  const deleteDiscount = async (discount_id) => {
    const agreeDelete = window.confirm(
      `Bạn có muốn xóa discount id: ${discount_id} không ??`
    );
    if (agreeDelete) {
      await axios
        .delete(`http://localhost:3000/discounts/${discount_id}`)
        .then((res) => {
          toast.success("Delete discount success");
        });
      setDeletC(true);
    }
    return 0;
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(6);
  // Get current
  const indexOfLast = currentPage * perPage;
  const indexOfFirst = indexOfLast - perPage;
  const current = discounts.slice(indexOfFirst, indexOfLast);
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const paginateNext = () => setCurrentPage(currentPage + 1);
  const paginatePrev = () => setCurrentPage(currentPage - 1);

  if (loading) return <LoadPage />;
  else
    return (
      <div className="data-table">
        <div className="data-table__heading">
          <span className="data-table__title">List discount product</span>
        </div>
        <Table bordered hover>
          <thead>
            <tr>
              <td>Stt</td>
              <td style={{ width: "250px" }}>Name</td>
              <td style={{ width: "170px" }}>Discount start</td>
              <td style={{ width: "170px" }}>Discount end</td>
              <td>Price</td>
              <td style={{ width: "200px" }}>Discount</td>
              <td style={{ width: "10%" }}>Thao tác</td>
            </tr>
          </thead>
          <tbody>
            {current.map((discount, index) => {
              return (
                <tr key={index}>
                  <td>{discount.discount_id}</td>
                  <td>{discount.product?.product_name}</td>
                  <td>
                    {moment(discount.discount?.discount_start)
                      .utc()
                      .format("DD-MM-YYYY")}
                  </td>
                  <td>
                    {moment(discount.discount?.discount_end)
                      .utc()
                      .format("DD-MM-YYYY")}
                  </td>
                  <td>
                    <span
                      style={{
                        color: "red",
                        textDecorationLine: "line-through",
                      }}
                    >
                      {" "}
                      {discount.product?.product_price.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}{" "}
                    </span>
                  </td>
                  <td>
                    {discount?.discount_percent
                      ? (
                          discount.product?.product_price -
                          (discount.product?.product_price *
                            discount?.discount_percent) /
                            100
                        ).toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })
                      : ""}
                    &ensp;
                    {discount.discount_percent ? (
                      <span> Giảm {discount.discount_percent} %</span>
                    ) : (
                      <span> Giảm 0 %</span>
                    )}
                  </td>
                  <td>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="tooltip-disabled">Update</Tooltip>}
                    >
                      <span className="d-inline-block">
                        <Link
                          to={`/discounts/updateDiscount/${discount.discount_id}`}
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
                      overlay={<Tooltip id="tooltip-disabled">Update</Tooltip>}
                    >
                      <Button
                        className="data-table__heading--button"
                        style={{ float: "right" }}
                        variant="outline-danger"
                        onClick={() => deleteDiscount(discount.discount_id)}
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
        {discounts.length >= "6" ? (
          <CheckPagination
            postsPerPage={perPage}
            totalPosts={discounts.length}
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

export default Discounts;
