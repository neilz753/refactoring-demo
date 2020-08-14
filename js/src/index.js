var plays;
var invoice;
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
function statement (i, p) {
    invoice = i, plays = p;
    let result = `Statement for ${invoice.customer}\n`;   
    for (let perf of invoice.performances) {
        // print line for this order
        result += `  ${playFor(perf).name}: ${ucd(amountFor(perf))} (${perf.audience} seats)\n`;
    }
    result += `Amount owned is ${ucd(totalAmount())}\n`;
    result += `You earned ${totalVolumeCredits()} credits\n`;
    return result;
}

/**
 * 计算当前剧的演出费用
 * @param {*} aPerformance 剧
 */
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

/**
 * 获取当前剧的playID
 * @param {*} aPerformance 剧
 */
function playFor(aPerformance) {
    return plays[aPerformance.playID];
}

/**
 * 计算当前剧的观众量积分
 * @param {*} aPerformance 剧
 */
function volumeCreditsFor(aPerformance) {
    let result = 0;
    result += Math.max(aPerformance.audience - 30, 0);
    if ("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);
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

/**
 * 总金额
 */
function totalAmount() {
    let result = 0;
    for (let perf of invoice.performances) {
        result += amountFor(perf);
    }
    return result;
}

/**
 * 总观众量积分
 */
function totalVolumeCredits() {
    let result = 0;
    for (let perf of invoice.performances) {
        result += volumeCreditsFor(perf);
    }
    return result;
}

module.exports = statement;