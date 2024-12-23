/**
 * 基础策略类，所有具体策略都继承自这个类
 * Reference: https://www.sudokuwiki.org/
 */
export class BaseStrategy {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    /**
     * 应用策略到数独板上
     * @param {Array<Array<number>>} board 数独板
     * @returns {Object} 返回是否找到解和相关信息
     */
    apply(board) {
        throw new Error('Strategy must implement apply method');
    }

    /**
     * 检查此策略是否适用
     * @param {Array<Array<number>>} board 数独板
     * @returns {boolean} 是否适用
     */
    isApplicable(board) {
        throw new Error('Strategy must implement isApplicable method');
    }
}
