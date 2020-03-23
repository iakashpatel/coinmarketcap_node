import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Dropdown from "react-bootstrap/Dropdown";
import { BumpChart } from "d3plus-react";
import { useHistory } from "react-router-dom";
import socketIOClient from "socket.io-client";
import { getNth } from "../utils/dashboardUtil";
const axios = require("axios");
const _ = require("lodash");

function ChartPage() {
  let history = useHistory();
  const [tickers, setTickers] = useState([]);
  const [limit, setLimit] = useState(10);

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

  function getChartData(tickersData) {
    const cData = tickersData.map(item => {
      const { data } = item;
      const sortedData = _.sortBy(data, [
        function(o) {
          return o.updated_timestamp;
        }
      ]);

      const latestData = Object.assign([], sortedData).pop();
      const { _id: id, name, ticker } = latestData;

      const mc_rank_1d = getNth(sortedData, 1, 3, "marketcap_rank", "");
      const mc_rank_3d = getNth(sortedData, 3, 5, "marketcap_rank", "");
      const mc_rank_5d = getNth(sortedData, 5, 7, "marketcap_rank", "");
      const mc_rank_7d = getNth(sortedData, 7, 9, "marketcap_rank", "");
      const mc_rank_9d = getNth(sortedData, 9, 11, "marketcap_rank", "");
      const mc_rank_11d = getNth(sortedData, 11, 13, "marketcap_rank", "");
      const mc_rank_13d = getNth(sortedData, 13, 21, "marketcap_rank", "");
      const mc_rank_21d = getNth(sortedData, 21, 21, "marketcap_rank", "");

      return [
        { day: 1, mc_rank: parseInt(mc_rank_1d.split("-S-")[0], 0) },
        { day: 3, mc_rank: parseInt(mc_rank_3d.split("-S-")[0], 0) },
        { day: 5, mc_rank: parseInt(mc_rank_5d.split("-S-")[0], 0) },
        { day: 7, mc_rank: parseInt(mc_rank_7d.split("-S-")[0], 0) },
        { day: 9, mc_rank: parseInt(mc_rank_9d.split("-S-")[0], 0) },
        { day: 11, mc_rank: parseInt(mc_rank_11d.split("-S-")[0], 0) },
        { day: 13, mc_rank: parseInt(mc_rank_13d.split("-S-")[0], 0) },
        { day: 21, mc_rank: parseInt(mc_rank_21d.split("-S-")[0], 0) }
      ].map(item => ({
        id,
        rank: item.mc_rank,
        name,
        ticker,
        day: item.day
      }));
    });

    return _.flatten(cData);
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
      const { coins: coinsData } = data;
      const tempData = getRankWiseSortedData(coinsData);
      setTickers(tempData);
    });
    // eslint-disable-next-line
  }, []);

  const limitData = tickers.slice(0, limit);
  const chartData = getChartData(limitData);
  const filterData = chartData.filter(x => !isNaN(x.rank));

  const config = {
    groupBy: "ticker",
    data: filterData,
    x: d => d["day"],
    y: d => d["rank"],
    label: d => d["name"]
  };

  return (
    <div>
      <Row>
        <Col xs={12} md={12}>
          <span className="custom-dropdown">
            <span>Select Size:</span>
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-limit">
                {limit}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setLimit(10)}>10</Dropdown.Item>
                <Dropdown.Item onClick={() => setLimit(25)}>25</Dropdown.Item>
                <Dropdown.Item onClick={() => setLimit(30)}>30</Dropdown.Item>
                <Dropdown.Item onClick={() => setLimit(50)}>50</Dropdown.Item>
                <Dropdown.Item onClick={() => setLimit(tickers.length)}>
                  {tickers.length}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </span>
          <div className="chart">
            <BumpChart config={config} />
          </div>
          <span className="custom-dropdown">
            <span>Select Size:</span>
            <Dropdown>
              <Dropdown.Toggle variant="dark" id="dropdown-limit">
                {limit}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setLimit(10)}>10</Dropdown.Item>
                <Dropdown.Item onClick={() => setLimit(25)}>25</Dropdown.Item>
                <Dropdown.Item onClick={() => setLimit(30)}>30</Dropdown.Item>
                <Dropdown.Item onClick={() => setLimit(50)}>50</Dropdown.Item>
                <Dropdown.Item onClick={() => setLimit(tickers.length)}>
                  {tickers.length}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </span>
        </Col>
      </Row>
    </div>
  );
}

export default ChartPage;
