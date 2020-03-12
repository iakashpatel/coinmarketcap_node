function nthCompare(data, n = 2, term = "marketcap_rank", default_value = 0) {
  let result = {
    diff: default_value,
    status: "-"
  };
  const tempData = Object.assign([], data).reverse();
  if (tempData.length >= n) {
    const tempData1 = {data:tempData}
    const {
      data: { [n-1]: nthData }
    } = tempData1;

    let sum = tempData[0][term] - nthData[term];
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
    }
  }
  return result;
}

module.exports = {
  nthCompare
};
