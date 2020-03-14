function nthCompare(data, n = 2, term = "marketcap_rank", default_value = 0) {
  let result = {
    diff: default_value,
    status: "-"
  };
  const tempData = Object.assign([], data).reverse();
  if (tempData.length >= n+1) {
    const tempData1 = { data: tempData };
    const {
      data: { [n]: nthData, [n - 1]: n1thData }
    } = tempData1;

    let sum = n1thData[term] - nthData[term];
    if (sum < 0) {
      result = {
        diff: sum,
        status: "low"
      };
    } else if (sum > 0) {
      result = {
        diff: sum,
        status: "high"
      };
    } else {
      result = {
        diff: '--',
        status: "--"
      };
    }
  }
  return result;
}

function getNth(data, n = 2, term = "marketcap_rank", default_value = "--") {
  let result = {
    diff: default_value,
    status: "-"
  };
  const tempData = Object.assign([], data).reverse();
  if (tempData.length >= n+1) {
    const tempData1 = { data: tempData };
    const {
      data: { [n]: nthData, [n - 1]: n1thData }
    } = tempData1;

    let sum = n1thData[term] - nthData[term];
    if (sum < 0) {
      result = {
        diff: nthData[term],
        status: "low"
      };
    } else if (sum > 0) {
      result = {
        diff: nthData[term],
        status: "high"
      };
    } else {
      result = {
        diff: nthData[term],
        status: "--"
      };
    }
  }
  return result;
}

module.exports = {
  nthCompare,
  getNth
};
