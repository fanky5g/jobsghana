const calculateFee = (fee, amount) => {
    if (fee.Fixed) {
        return parseFloat(fee.Fee);
    }

    const feeNum = parseFloat(fee.Fee);
    const amountNum = parseFloat(amount);
    const percentFee = (feeNum / 100);
    var result = percentFee * amountNum;
    return result.toFixed(2);
};

const getLowerBound = (amount) => {
    let returnVal = 0;
    amount = parseFloat(amount);

    if (amount <= 10) {
        returnVal = 1
    } else if (amount <= 20) {
        returnVal = 11
    } else if (amount <= 49) {
        returnVal = 21
    } else if (amount <= 100) {
        returnVal = 50
    } else if (amount <= 300) {
        returnVal = 101
    } else {
        returnVal = 301
    }
    return returnVal;
};

export const extimateTotal = (rate, fee, amount) => {
    const feeEstimate = calculateFee(fee, amount);
    const amountNum = parseFloat(amount, 10);
    return {
        total: ((amountNum - feeEstimate) * rate.ExchangeRate).toFixed(2),
        fee: feeEstimate,
    };
};

export const lowerBoundChanged = (prevAmount, nextAmount) => {
    return getLowerBound(prevAmount) !== getLowerBound(nextAmount)
};
