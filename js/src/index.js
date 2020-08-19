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
function statement (invoice, plays) {
    const statementData = {};
    statementData.customer = invoice.customer;
    statementData.performances = invoice.performances.map(enrichPerformance);
    statementData.totalAmount = totalAmount(statementData);
    statementData.totalVolumeCredits = totalVolumeCredits(statementData);
    return renderPlainText(statementData, plays);
  
    function enrichPerformance(aPerformance) {
        // 返回一个浅副本
        const result = Object.assign({}, aPerformance);
        result.play = playFor(result);
        result.amount = amountFor(result);
        result.volumeCredits = volumeCreditsFor(result);
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
     * 计算当前剧的演出费用
     * @param {*} aPerformance 剧
     */
    function amountFor(aPerformance) {
        let result = 0;
        switch (aPerformance.play.type) {
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
            throw new Error(`unknown type: ${aPerformance.play.type}`);
        }
        return result;
    }

    /**
     * 计算当前剧的观众量积分
     * @param {*} aPerformance 剧
     */
    function volumeCreditsFor(aPerformance) {
        let result = 0;
        result += Math.max(aPerformance.audience - 30, 0);
        if ("comedy" === aPerformance.play.type) result += Math.floor(aPerformance.audience / 5);
        return result;
    }

    /**
    * 总金额
    */
    function totalAmount(data) {
        return data.performances.reduce((total, p) => total + p.amount, 0);
    }

    /**
    * 总观众量积分
    */
    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p) => total + p.volumeCredits, 0);
    }
}

function renderPlainText(data, plays) {
    let result = `Statement for ${data.customer}\n`;   
    for (let perf of data.performances) {
        // print line for this order
        result += `  ${perf.play.name}: ${ucd(perf.amount)} (${perf.audience} seats)\n`;
    }
    result += `Amount owned is ${ucd(data.totalAmount)}\n`;
    result += `You earned ${data.totalVolumeCredits} credits\n`;
    return result;

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
}

module.exports = statement;