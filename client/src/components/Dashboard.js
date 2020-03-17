import React, { useState, useEffect } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Jumbotron from "react-bootstrap/Jumbotron";
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
    dataField: "mc_rank_14d",
    text: "Rank 14d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_1mo",
    text: "Rank 1mo",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_2mo",
    text: "Rank 2mo",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_3mo",
    text: "Rank 3mo",
    sort: true,
    formatter: renderSignal
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
    dataField: "mc_rank_change_14d",
    text: "RC 14d",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_1mo",
    text: "RC 1mo",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_2mo",
    text: "RC 2mo",
    sort: true,
    formatter: renderSignal
  },
  {
    dataField: "mc_rank_change_3mo",
    text: "RC 3mo",
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
        14,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_14d = nthCompare(
        sortedData,
        14,
        30,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_1mo = nthCompare(
        sortedData,
        30,
        60,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_2mo = nthCompare(
        sortedData,
        60,
        90,
        "marketcap_rank",
        ""
      );
      const mc_rank_change_3mo = nthCompare(
        sortedData,
        90,
        90,
        "marketcap_rank",
        ""
      );
      const mc_rank_1d = getNth(sortedData, 1, 3, "marketcap_rank", "");
      const mc_rank_3d = getNth(sortedData, 3, 5, "marketcap_rank", "");
      const mc_rank_5d = getNth(sortedData, 5, 7, "marketcap_rank", "");
      const mc_rank_7d = getNth(sortedData, 7, 14, "marketcap_rank", "");
      const mc_rank_14d = getNth(sortedData, 14, 30, "marketcap_rank", "");
      const mc_rank_1mo = getNth(sortedData, 30, 60, "marketcap_rank", "");
      const mc_rank_2mo = getNth(sortedData, 60, 90, "marketcap_rank", "");
      const mc_rank_3mo = getNth(sortedData, 90, 90, "marketcap_rank", "");

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
        mc_rank_change_14d,
        mc_rank_change_1mo,
        mc_rank_change_2mo,
        mc_rank_change_3mo,
        mc_rank_1d,
        mc_rank_3d,
        mc_rank_5d,
        mc_rank_7d,
        mc_rank_14d,
        mc_rank_1mo,
        mc_rank_2mo,
        mc_rank_3mo
      };
    });
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
                    <hr />
                    <ToggleList {...props.columnToggleProps} />
                    <hr />
                    <BootstrapTable
                      hover
                      // striped
                      bordered
                      condensed
                      {...props.baseProps} />
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
