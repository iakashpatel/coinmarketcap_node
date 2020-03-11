import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Jumbotron from "react-bootstrap/Jumbotron";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";
const axios = require("axios");

function RenderSignal(props) {
  const { varient, children } = props;
  if (varient === "high") {
    return (
      <span className="high">
        {children}
        <img src="/high.png" alt="high signal" className="up-down-icons" />
      </span>
    );
  } else if (varient === "low") {
    return (
      <span className="low">
        {children}
        <img src="/low.png" alt="low signal" className="up-down-icons" />
      </span>
    );
  } else {
    return <span>{children}</span>;
  }
}

function Dashboard() {
  let history = useHistory();
  const [tickers, setTickers] = useState([]);

  function formatMoney(
    amount,
    decimalCount = 2,
    decimal = ".",
    thousands = ","
  ) {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i = parseInt(
        (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
      ).toString();
      let j = i.length > 3 ? i.length % 3 : 0;

      return (
        negativeSign +
        (j ? i.substr(0, j) + thousands : "") +
        i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
        (decimalCount
          ? decimal +
            Math.abs(amount - i)
              .toFixed(decimalCount)
              .slice(2)
          : "")
      );
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchCoins() {
    try {
      const coins = await axios.get("/coins");
      const { data } = coins;
      setTickers(data);
    } catch (error) {
      history.replace("/login");
      console.log("error-checkuser", error);
    }
  }

  useEffect(() => {
    fetchCoins();
    const socket = socketIOClient(process.env.REACT_APP_BACKEND_URL);
    socket.on("FromAPI", data => {
      console.log("updated!!");
      setTickers(data);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Row>
        <Col xs={12} md={12}>
          <Jumbotron>
            <h1>Welcome to Coinmarketcap!</h1>
          </Jumbotron>
          <Table bordered hover>
            <colgroup span="5"></colgroup>
            <colgroup span="2"></colgroup>
            <colgroup span="2"></colgroup>
            <thead>
              <tr>
                <td colSpan="5"></td>
                <th colSpan="8" scope="colgroup">
                  MC rank
                </th>
                <th colSpan="8" scope="colgroup">
                  MC change
                </th>
              </tr>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Marketcap</th>
                <th>Price</th>
                <th>Volume</th>
                <th>1d</th>
                <th>3d</th>
                <th>5d</th>
                <th>7d</th>
                <th>14d</th>
                <th>1mo</th>
                <th>2mo</th>
                <th>3mo</th>
                <th>1d</th>
                <th>3d</th>
                <th>5d</th>
                <th>7d</th>
                <th>14d</th>
                <th>1mo</th>
                <th>2mo</th>
                <th>3mo</th>
              </tr>
            </thead>
            <tbody>
              {tickers.map((item, index) => {
                const {
                  marketcap_rank,
                  marketcap_usd,
                  name,
                  price_usd,
                  volume
                } = item;
                return (
                  <tr key={index}>
                    <td>{marketcap_rank}</td>
                    <td>{name}</td>
                    <td>${formatMoney(marketcap_usd, 2, ".", ",")}</td>
                    <td>${formatMoney(price_usd, 2, ".", ",")}</td>
                    <td>${formatMoney(volume, 2, ".", ",")}</td>
                    {/* MC Rank change  */}
                    <td>
                      <RenderSignal>{marketcap_rank}</RenderSignal>
                    </td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    {/* MC change  */}
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
