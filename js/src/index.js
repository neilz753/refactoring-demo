const createStatementData = require("./createStatementData");
/**
 * 
 * 场景：
 * 戏剧演出团，演员要去各种场合表演戏剧。
 * 戏剧分为悲剧（tragedy）和喜剧（comedy）
 * 剧团会根据观众（audience）人数和剧目类型收费，
 * 同时还会根据到场观众的数量给出“观众量积分”（volume credit）优惠，积分可以抵折扣。
 * 
 * @param {*} invoice 账单
 * @param {*} plays 演员
 */
module.exports.statement = function (invoice, plays) {
    return renderPlainText(createStatementData(invoice, plays));
}

module.exports.htmlStatement = function (invoice, plays) {
    return renderHtml(createStatementData(invoice, plays));
}

function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1>\n`;
    result += "<table>\n";
    result += "<tr><th>play</th><th>seats</th><th>cost</th></tr>\n"
    for (let perf of data.performances) {
        result += ` <tr><td>${perf.play.name}</td><td>${perf.audience}</td>`;
        result += `<td>${ucd(perf.amount)}</td></tr>\n`;
    }
    result += "</table>\n";
    result += `<p>Amount owed is <em>${ucd(data.totalAmount)}</em></p>\n`;
    result += `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p>\n`;
    return result;
}

function renderPlainText(data) {
    let result = `Statement for ${data.customer}\n`;   
    for (let perf of data.performances) {
        // print line for this order
        result += `  ${perf.play.name}: ${ucd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owned is ${ucd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;
}

/**
* 格式化数字格式 美元
* @param {*} aNumber 美分数字
*/
function ucd(aNumber) {
    return new Intl.NumberFormat("en-US", {
        style: "currency", 
        currency: "USD", 
        minimumFractionDigits: 2}).format(aNumber/100);
}