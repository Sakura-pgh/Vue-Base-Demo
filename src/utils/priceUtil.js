/**
 * 金额工具
 */

/**
 * 格式化金额，返回字符串，整数，小数;注意传参过来的金额为元
 */
export const formatMoney = (price = 0, symbol = true) => {
	let priceStr = Number.parseFloat(price).toFixed(2);

	let split = priceStr.toString().split('.');
	let optimize = '';
	if (split[1] === '00') {
		optimize = split[0];
	} else {
		optimize = priceStr;
	}

	return {
		str: `${symbol ? '¥' : ''}${priceStr}`,
		integer: split[0],
		decimals: split[1],
		optimize: optimize
	};
};

/**
 * 分转元
 */
export const centTransferDollar = (price = 0, symbol = true) => {
	let priceStr = `${(price * 100 / 10000).toFixed(2)}`;
	return formatMoney(priceStr, symbol);
};