/**
 * 场景：
 * 戏剧演出团，演员要去各种场合表演戏剧。
 * 戏剧分为悲剧（tragedy）和喜剧（comedy）
 * 剧团会根据观众（audience）人数和剧目类型收费，
 * 同时还会根据到场观众的数量给出“观众量积分”（volume credit）优惠，积分可以抵折扣。
 * 
 * @param {*} invoice 账单
 * @param {*} plays 演员
 */
var plays;

function statement (invoice, play) {
    plays = play;
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat("en-US", {
        style: "currency", 
        currency: "USD", 
        minimumFractionDigits: 2}).format;
    
    for (let perf of invoice.performances) {

        // add volume credits
        volumeCredits += Math.max(perf.audience - 30, 0);
        // add extra credit for every ten comedy attendees
        if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5);

        // print line for this order
        result += `  ${playFor(perf).name}: ${format(amountFor(perf)/100)} (${perf.audience} seats)\n`;
        totalAmount += amountFor(perf);
    }
    result += `Amount owned is ${format(totalAmount/100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
}

function amountFor(aPerformance) {
    let result = 0;
    switch (playFor(aPerformance).type) {
    case "tragedy":
        result = 40000;
        if (aPerformance.audience > 30) {
            result += 1000 * (aPerformance.audience - 30);
        }
        break;
    case "comedy":
        result = 30000;
        if (aPerformance.audience > 20) {
            result += 10000 + 500 * (aPerformance.audience - 20);
        }
        result += 300 * aPerformance.audience;
        break;
    default:
        throw new Error(`unknown type: ${playFor(aPerformance).type}`);
    }
    return result;
}

function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

module.exports = statement;