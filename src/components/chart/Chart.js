import "./chart.css";
import React, { useEffect, useState } from "react";
import {
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
} from "recharts";
import * as orderApi from "../../api/order";
import Form from "react-bootstrap/Form";

function Chart() {
  const data = [];
  const [statistical, setStatistical] = useState([]);
  const [year, setYear] = useState();
  useEffect(() => {
    const fetchAPI = async () => {
      let data = [];
      data = await orderApi.get("order/statistical");
      if (year !== undefined) {
        data = await orderApi.get(`order/statistical?year=${year}`);
      }
      setStatistical(data.statistical);
    };
    fetchAPI();
  }, [year]);

  statistical.map((item) => {
    return data.push(item);
  });

  const checkYear = (value) => {
    setYear(value);
  };
  return (
    <div className="chart">
      <div className="title">
        Last 12 Months (Revenue)
        <Form.Select
          onChange={(e) => {
            checkYear(e.target.value);
          }}
          style={{ width: "110px", textAlign: "center" }}
          aria-label="Default select example"
        >
          <option>Years</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </Form.Select>
      </div>
      <AreaChart
        width={730}
        height={250}
        data={data}
        margin={{ top: 10, right: 30, left: 40, bottom: 0 }}
      >
        <defs>
          <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="month" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="Total"
          stroke="#8884d8"
          fillOpacity={1}
          fill="url(#total)"
        />
      </AreaChart>
    </div>
  );
}

export default Chart;
