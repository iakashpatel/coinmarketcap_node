import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Jumbotron from "react-bootstrap/Jumbotron";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";
const axios = require("axios");
const _ = require("lodash");
const { nthCompare } = require("../utils/compareUtil");

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
    thousands = ",",
    sign = "$"
  ) {
    try {
      if (!isNaN(amount)) {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

        const negativeSign = amount < 0 ? "-" : "";

        let i = parseInt(
          (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
        ).toString();
        let j = i.length > 3 ? i.length % 3 : 0;

        return (
          negativeSign +
          sign +
          (j ? i.substr(0, j) + thousands : "") +
          i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
          (decimalCount
            ? decimal +
              Math.abs(amount - i)
                .toFixed(decimalCount)
                .slice(2)
            : "")
        );
      } else {
        return "--";
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function fetchCoins() {
    try {
      const coins = await axios.get("/coins");
      const { data } = coins;
      const { coins: coinsData } = data;
      setTickers(coinsData);
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
                const { data } = item;
                const sortedData = _.sortBy(data, [
                  function(o) {
                    return o.updated_timestamp;
                  }
                ]);
                const latestData = Object.assign([], sortedData).pop();
                const {
                  marketcap_rank,
                  marketcap_usd,
                  name,
                  price_usd,
                  volume
                } = latestData;
                
                const mc_rank_1d = nthCompare(sortedData,2,"marketcap_rank", '--');
                const mc_rank_3d = nthCompare(sortedData,3,"marketcap_rank", '--');
                const mc_rank_5d = nthCompare(sortedData,5,"marketcap_rank", '--');
                const mc_rank_7d = nthCompare(sortedData,7,"marketcap_rank", '--');
                const mc_rank_14d = nthCompare(sortedData,14,"marketcap_rank", '--');
                const mc_rank_1mo = nthCompare(sortedData,30,"marketcap_rank", '--');
                const mc_rank_2mo = nthCompare(sortedData,60,"marketcap_rank", '--');
                const mc_rank_3mo = nthCompare(sortedData,90,"marketcap_rank", '--');
                const mc_usd_1d = nthCompare(sortedData,2,"marketcap_usd", '--');
                const mc_usd_3d = nthCompare(sortedData,3,"marketcap_usd", '--');
                const mc_usd_5d = nthCompare(sortedData,5,"marketcap_usd", '--');
                const mc_usd_7d = nthCompare(sortedData,7,"marketcap_usd", '--');
                const mc_usd_14d = nthCompare(sortedData,14,"marketcap_usd", '--');
                const mc_usd_1mo = nthCompare(sortedData,30,"marketcap_usd", '--');
                const mc_usd_2mo = nthCompare(sortedData,60,"marketcap_usd", '--');
                const mc_usd_3mo= nthCompare(sortedData,90,"marketcap_usd", '--');
                
                return (
                  <tr key={index}>
                    <td>{marketcap_rank}</td>
                    <td>{name}</td>
                    <td>{formatMoney(marketcap_usd, 2, ".", ",")}</td>
                    <td>{formatMoney(price_usd, 2, ".", ",")}</td>
                    <td>{formatMoney(volume, 2, ".", ",")}</td>

                    {/* MC Rank change  */}
                    <td>
                      <RenderSignal varient={mc_rank_1d.status}>
                        {mc_rank_1d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_3d.status}>
                        {mc_rank_3d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_5d.status}>
                        {mc_rank_5d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_7d.status}>
                        {mc_rank_7d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_14d.status}>
                        {mc_rank_14d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_1mo.status}>
                        {mc_rank_1mo.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_2mo.status}>
                        {mc_rank_2mo.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_3mo.status}>
                        {mc_rank_3mo.diff}
                      </RenderSignal>
                    </td>

                    {/* MC change  */}
                    <td>
                      <RenderSignal varient={mc_usd_1d.status}>
                        {formatMoney(mc_usd_1d.diff, 2, ".", ",")}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_usd_3d.status}>
                        {formatMoney(mc_usd_3d.diff, 2, ".", ",")}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_usd_5d.status}>
                        {formatMoney(mc_usd_5d.diff, 2, ".", ",")}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_usd_7d.status}>
                        {formatMoney(mc_usd_7d.diff, 2, ".", ",")}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_usd_14d.status}>
                        {formatMoney(mc_usd_14d.diff, 2, ".", ",")}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_usd_1mo.status}>
                        {formatMoney(mc_usd_1mo.diff, 2, ".", ",")}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_usd_2mo.status}>
                        {formatMoney(mc_usd_2mo.diff, 2, ".", ",")}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_usd_3mo.status}>
                        {formatMoney(mc_usd_3mo.diff, 2, ".", ",")}
                      </RenderSignal>
                    </td>
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
