import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useHistory } from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  ColumnToggle,
  Search
} from "react-bootstrap-table2-toolkit";
import socketIOClient from "socket.io-client";
import { nthCompare, getNth, formatMoney } from "../utils/dashboardUtil";
const axios = require("axios");
const _ = require("lodash");

const { ToggleList } = ColumnToggle;
const { SearchBar, ClearSearchButton } = Search;

function renderSignal(cell) {
  const [value = "", varient = ""] = cell.split("-S-");
  if (varient === "2") {
    return (
      <span className="high">
        {value}
        <img src="/high.png" alt="high signal" className="up-down-icons" />
      </span>
    );
  } else if (varient === "0") {
    return (
      <span className="low">
        {value}
        <img src="/low.png" alt="low signal" className="up-down-icons" />
      </span>
    );
  } else {
    return <span>{value}</span>;
  }
}

const columns = [
  {
    dataField: "marketcap_rank",
    text: "#",
    sort: true
  },
  {
    dataField: "name",
    text: "Name",
    sort: true
  },
  {
    dataField: "marketcap_usd",
    text: "Marketcap",
    sort: true,
    formatter: cell => formatMoney(cell)
  },
  {
    dataField: "price_usd",
    text: "Price",
    sort: true,
    formatter: cell => formatMoney(cell)
  },
  {
    dataField: "volume",
    text: "Volume",
    sort: true,
    formatter: cell => formatMoney(cell)
  },
  {
    dataField: "mc_rank_change_1d",
    text: "RC 1d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_3d",
    text: "RC 3d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_5d",
    text: "RC 5d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_7d",
    text: "RC 7d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_9d",
    text: "RC 9d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_11d",
    text: "RC 11d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_13d",
    text: "RC 13d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_21d",
    text: "RC 21d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_1d",
    text: "Rank 1d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_3d",
    text: "Rank 3d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_5d",
    text: "Rank 5d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_7d",
    text: "Rank 7d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_9d",
    text: "Rank 9d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_11d",
    text: "Rank 11d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_13d",
    text: "Rank 13d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_21d",
    text: "Rank 21d",
    sort: true,
    formatter: renderSignal
  }
];

const defaultSorted = [
  {
    dataField: "marketcap_rank",
    order: "asc"
  }
];

function Dashboard() {
  let history = useHistory();
  const [tickers, setTickers] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date().toString());

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

  function tableData() {
    return tickers.map(item => {
      const { data } = item;
      const sortedData = _.sortBy(data, [
        function(o) {
          return o.updated_timestamp;
        }
      ]);

      const latestData = Object.assign([], sortedData).pop();
      const {
        _id: id,
        marketcap_rank,
        marketcap_usd,
        name,
        price_usd,
        volume
      } = latestData;

      const mc_rank_change_1d = nthCompare(
        sortedData,
        1,
        3,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_3d = nthCompare(
        sortedData,
        3,
        5,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_5d = nthCompare(
        sortedData,
        5,
        7,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_7d = nthCompare(
        sortedData,
        7,
        9,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_9d = nthCompare(
        sortedData,
        9,
        11,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_11d = nthCompare(
        sortedData,
        11,
        13,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_13d = nthCompare(
        sortedData,
        13,
        21,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_21d = nthCompare(
        sortedData,
        21,
        21,
        "marketcap_rank",
        ""
      );
      const mc_rank_1d = getNth(sortedData, 1, 3, "marketcap_rank", "");
      const mc_rank_3d = getNth(sortedData, 3, 5, "marketcap_rank", "");
      const mc_rank_5d = getNth(sortedData, 5, 7, "marketcap_rank", "");
      const mc_rank_7d = getNth(sortedData, 7, 9, "marketcap_rank", "");
      const mc_rank_9d = getNth(sortedData, 9, 11, "marketcap_rank", "");
      const mc_rank_11d = getNth(sortedData, 11, 13, "marketcap_rank", "");
      const mc_rank_13d = getNth(sortedData, 13, 21, "marketcap_rank", "");
      const mc_rank_21d = getNth(sortedData, 21, 21, "marketcap_rank", "");

      return {
        id,
        marketcap_rank,
        marketcap_usd,
        name,
        price_usd,
        volume,
        mc_rank_change_1d,
        mc_rank_change_3d,
        mc_rank_change_5d,
        mc_rank_change_7d,
        mc_rank_change_9d,
        mc_rank_change_11d,
        mc_rank_change_13d,
        mc_rank_change_21d,
        mc_rank_1d,
        mc_rank_3d,
        mc_rank_5d,
        mc_rank_7d,
        mc_rank_9d,
        mc_rank_11d,
        mc_rank_13d,
        mc_rank_21d
      };
    });
  }

  async function fetchCoins() {
    try {
      setLoading(false);
      const coins = await axios.get("/coins");
      const { data } = coins;
      const { coins: coinsData } = data;
      const tempData = getRankWiseSortedData(coinsData);
      setTickers(tempData);
      setLastUpdated(new Date().toString());
    } catch (error) {
      history.replace("/login");
      console.log("error-checkuser", error);
    }
  }

  async function refreshCoinsData() {
    try {
      setLoading(true);
      const coins = await axios.get("/coins/refresh");
      const { data } = coins;
      const { success = false } = data;
      if (success) {
        setTimeout(fetchCoins, 3000);
      }
    } catch (error) {
      setLoading(false);
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
      setLastUpdated(new Date().toString());
    });
    // eslint-disable-next-line
  }, []);

  const data = tableData();

  return (
    <div>
      <Row>
        <Col xs={12} md={12}>
          <Jumbotron>
            <h4>
              {"Identify trends & changes in marketcap rankings of crypto"}{" "}
            </h4>
          </Jumbotron>

          <Row>
            <Col xs={12} md={12}>
              <ToolkitProvider
                bootstrap4
                keyField="id"
                data={data}
                columns={columns}
                columnToggle
                defaultSorted={defaultSorted}
                search
              >
                {props => (
                  <div>
                    <SearchBar {...props.searchProps} />
                    <ClearSearchButton {...props.searchProps} />
                    <span>
                      {/* <Spinner animation="border" /> */}
                      <Button
                        variant="success"
                        className="refresh"
                        onClick={refreshCoinsData}
                        disabled={isLoading}
                      >
                        {isLoading ? "Fetching..." : "Refresh data"}
                      </Button>
                      <Alert variant="light" className="datetime-refresh">
                        Updated: <b>{lastUpdated}</b>
                      </Alert>
                    </span>
                    <hr />
                    <ToggleList {...props.columnToggleProps} />
                    <hr />
                    <BootstrapTable
                      hover
                      // striped
                      bordered
                      condensed
                      {...props.baseProps}
                    />
                  </div>
                )}
              </ToolkitProvider>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
