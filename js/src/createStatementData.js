module.exports = function (invoice, plays) {
    const result = {};
    result.customer = invoice.customer;
    result.performances = invoice.performances.map(enrichPerformance);
    result.totalAmount = totalAmount(result);
    result.totalVolumeCredits = totalVolumeCredits(result);
    return result;

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