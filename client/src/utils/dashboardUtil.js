function nthCompare(
  data,
  n = 1,
  n1 = 3,
  term = "marketcap_rank",
  default_value = 0
) {
  let result = {
    diff: default_value,
    status: ""
  };
  const tempData = Object.assign([], data).reverse();
  if (tempData.length >= n1) {
    const tempData1 = { data: tempData };
    const {
      data: { [n - 1]: nthData, [n1 - 1]: n1thData }
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
        diff: "",
        status: ""
      };
    }
  }
  return result;
}

function getNth(
  data,
  n = 1,
  n1 = 3,
  term = "marketcap_rank",
  default_value = ""
) {
  let result = {
    diff: default_value,
    status: ""
  };
  const tempData = Object.assign([], data).reverse();
  if (tempData.length >= n1) {
    const tempData1 = { data: tempData };
    const {
      data: { [n - 1]: nthData, [n1 - 1]: n1thData }
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
        status: ""
      };
    }
  } else if (tempData.length >= n) {
    const tempData1 = { data: tempData };
    const {
      data: { [n - 1]: nthData }
    } = tempData1;
    result = {
      diff: nthData[term],
      status: ""
    };
  }
  return result;
}

function formatMoney(
  amount,
  decimalCount = 0,
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
      return "";
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  nthCompare,
  getNth,
  formatMoney
};
