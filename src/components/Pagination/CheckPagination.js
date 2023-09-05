import React from "react";
import Pagination from "react-bootstrap/Pagination";

const CheckPagination = ({ postsPerPage, totalPosts, paginate, paginateNext, paginatePrev }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <Pagination>
      <Pagination.Prev onClick={() => paginatePrev()} />
      {pageNumbers.map((number) => (
        <Pagination.Item onClick={() => paginate(number)} key={number}>
          {" "}
          {number}
        </Pagination.Item>
      ))}

      <Pagination.Next onClick={() => paginateNext()} />
    </Pagination>
    // <nav>
    //   <ul className='pagination'>

    //   </ul>
    // </nav>
  );
};

export default CheckPagination;
