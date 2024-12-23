import { BaseStrategy } from './BaseStrategy';

/**
 * 基本消除策略
 * 通过检查每个单元格的行、列和宫格来消除不可能的数字
 */
export class BasicEliminationStrategy extends BaseStrategy {
    constructor() {
        super(
            'Basic Elimination', 
            'Check each cell\'s row, column and box to eliminate impossible numbers'
        );
    }

    /**
     * 检查数字是否已经在行中出现
     * @param {Array<Array<number>>} board 数独板
     * @param {number} row 行号
     * @param {number} num 要检查的数字
     * @returns {boolean} 是否在行中出现
     */
    isNumberInRow(board, row, num) {
        return board[row].includes(num);
    }

    /**
     * 检查数字是否已经在列中出现
     * @param {Array<Array<number>>} board 数独板
     * @param {number} col 列号
     * @param {number} num 要检查的数字
     * @returns {boolean} 是否在列中出现
     */
    isNumberInColumn(board, col, num) {
        return board.some(row => row[col] === num);
    }

    /**
     * 检查数字是否已经在3x3宫格中出现
     * @param {Array<Array<number>>} board 数独板
     * @param {number} startRow 宫格起始行号
     * @param {number} startCol 宫格起始列号
     * @param {number} num 要检查的数字
     * @returns {boolean} 是否在宫格中出现
     */
    isNumberInBox(board, startRow, startCol, num) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row + startRow][col + startCol] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 获取单元格可能的数字
     * @param {Array<Array<number>>} board 数独板
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {Array<number>} 可能的数字列表
     */
    getPossibleNumbers(board, row, col) {
        if (board[row][col] !== 0) {
            return [];
        }

        const possibleNumbers = [];
        const boxStartRow = Math.floor(row / 3) * 3;
        const boxStartCol = Math.floor(col / 3) * 3;

        for (let num = 1; num <= 9; num++) {
            if (!this.isNumberInRow(board, row, num) &&
                !this.isNumberInColumn(board, col, num) &&
                !this.isNumberInBox(board, boxStartRow, boxStartCol, num)) {
                possibleNumbers.push(num);
            }
        }

        return possibleNumbers;
    }

    /**
     * 应用策略到数独板上
     * @param {Array<Array<number>>} board 数独板
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {Object} 返回是否找到解和相关信息
     */
    apply(board, row, col) {
        console.log('BasicEliminationStrategy.apply called with:', { row, col });
        console.log('Cell value:', board[row][col]);
        
        if (board[row][col] === 0) {
            const possibleNumbers = this.getPossibleNumbers(board, row, col);
            console.log('Possible numbers:', possibleNumbers);
            
            if (possibleNumbers.length > 0) {
                console.log('Found possibilities:', possibleNumbers);
                return {
                    found: true,
                    value: possibleNumbers,
                    description: possibleNumbers.length === 1 
                        ? `Cell (${row + 1},${col + 1}) can only be ${possibleNumbers[0]} based on basic elimination rules.`
                        : `Cell (${row + 1},${col + 1}) can be one of [${possibleNumbers.join(', ')}] based on basic elimination rules.`
                };
            }
        }
        console.log('No solution found');
        return { found: false };
    }

    /**
     * 检查此策略是否适用
     * @param {Array<Array<number>>} board 数独板
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {boolean} 是否适用
     */
    isApplicable(board, row, col) {
        return board[row][col] === 0;
    }
}
