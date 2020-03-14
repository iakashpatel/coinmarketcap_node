import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Jumbotron from "react-bootstrap/Jumbotron";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";
const axios = require("axios");
const _ = require("lodash");
const { nthCompare, getNth } = require("../utils/compareUtil");

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

  function getRankWiseSortedData(coinsData = []) {
    const tempData = coinsData.sort(function(a, b) {
      const { data: aData } = a;
      const { data: bData } = b;

      const asortedData = _.sortBy(aData, [
        function(o) {
          return o.updated_timestamp;
        }
      ]);

      const bsortedData = _.sortBy(bData, [
        function(o) {
          return o.updated_timestamp;
        }
      ]);

      const alatestData = Object.assign([], asortedData).pop();
      const blatestData = Object.assign([], bsortedData).pop();
      const { marketcap_rank: a_marketcap_rank } = alatestData;
      const { marketcap_rank: b_marketcap_rank } = blatestData;
      return a_marketcap_rank - b_marketcap_rank;
    });
    return tempData;
  }

  async function fetchCoins() {
    try {
      const coins = await axios.get("/coins");
      const { data } = coins;
      const { coins: coinsData } = data;
      const tempData = getRankWiseSortedData(coinsData);
      setTickers(tempData);
    } catch (error) {
      history.replace("/login");
      console.log("error-checkuser", error);
    }
  }

  useEffect(() => {
    fetchCoins();
    const socket = socketIOClient(process.env.REACT_APP_BACKEND_URL);
    socket.on("FromAPI", data => {
      console.log("socket updated data!!");
      const tempData = getRankWiseSortedData(data);
      setTickers(tempData);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <Row>
        <Col xs={12} md={12}>
          <Jumbotron>
            <h4>Identify trends & changes in marketcap rankings of crypto </h4>
          </Jumbotron>
          <Table bordered hover striped size="sm" responsive>
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

                const mc_rank_change_1d = nthCompare(
                  sortedData,
                  1,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_change_3d = nthCompare(
                  sortedData,
                  3,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_change_5d = nthCompare(
                  sortedData,
                  5,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_change_7d = nthCompare(
                  sortedData,
                  7,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_change_14d = nthCompare(
                  sortedData,
                  14,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_change_1mo = nthCompare(
                  sortedData,
                  30,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_change_2mo = nthCompare(
                  sortedData,
                  60,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_change_3mo = nthCompare(
                  sortedData,
                  90,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_1d = getNth(
                  sortedData,
                  1,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_3d = getNth(
                  sortedData,
                  3,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_5d = getNth(
                  sortedData,
                  5,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_7d = getNth(
                  sortedData,
                  7,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_14d = getNth(
                  sortedData,
                  14,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_1mo = getNth(
                  sortedData,
                  30,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_2mo = getNth(
                  sortedData,
                  60,
                  "marketcap_rank",
                  "--"
                );
                const mc_rank_3mo = getNth(
                  sortedData,
                  90,
                  "marketcap_rank",
                  "--"
                );

                return (
                  <tr key={index}>
                    <td>{marketcap_rank}</td>
                    <td>{name}</td>
                    <td>{formatMoney(marketcap_usd, 2, ".", ",")}</td>
                    <td>{formatMoney(price_usd, 2, ".", ",")}</td>
                    <td>{formatMoney(volume, 2, ".", ",")}</td>

                    {/* MC Rank  */}
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

                    {/* MC Rank change  */}
                    <td>
                      <RenderSignal varient={mc_rank_change_1d.status}>
                        {mc_rank_change_1d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_change_3d.status}>
                        {mc_rank_change_3d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_change_5d.status}>
                        {mc_rank_change_5d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_change_7d.status}>
                        {mc_rank_change_7d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_change_14d.status}>
                        {mc_rank_change_14d.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_change_1mo.status}>
                        {mc_rank_change_1mo.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_change_2mo.status}>
                        {mc_rank_change_2mo.diff}
                      </RenderSignal>
                    </td>
                    <td>
                      <RenderSignal varient={mc_rank_change_3mo.status}>
                        {mc_rank_change_3mo.diff}
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
