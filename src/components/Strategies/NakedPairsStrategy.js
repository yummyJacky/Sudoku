import { BaseStrategy } from './BaseStrategy';
import { get } from 'svelte/store';
import { candidates } from '@sudoku/stores/candidates';

/**
 * 赤裸对策略
 * 如果在同一行、列或宫格中有两个单元格只能填入相同的两个数字，
 * 那么这两个数字就不能出现在同一行、列或宫格的其他单元格中
 */
export class NakedPairsStrategy extends BaseStrategy {
    constructor() {
        super(
            'Naked Pairs',
            'If two cells in the same row, column or box can only contain the same two numbers, then those numbers cannot appear in other cells in the same row, column or box'
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
     * 获取单元格的候选数字
     * @param {Array<Array<number>>} board 数独板
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {Array<number>} 候选数字列表
     */
    getCandidates(board, row, col) {
        const $candidates = get(candidates);
        const key = `${col},${row}`;  // 注意：candidates store 使用 'x,y' 格式
        const storedCandidates = $candidates[key] || [];
        
        // 如果没有存储的候选数字，使用基本消除规则获取
        if (storedCandidates.length === 0) {
            return this.getPossibleNumbers(board, row, col);
        }
        
        return storedCandidates;
    }

    /**
     * 应用策略到数独板上
     * @param {Array<Array<number>>} board 数独板
     * @param {number} row 行号
     * @param {number} col 列号
     * @returns {Object} 返回是否找到解和相关信息
     */
    apply(board, row, col) {
        console.log('NakedPairsStrategy.apply called with:', { row, col });
        
        // 获取当前单元格的候选数字
        const currentCandidates = this.getCandidates(board, row, col);
        console.log('Current cell candidates:', currentCandidates);
        
        if (currentCandidates.length === 0) {
            return { found: false };
        }

        // 获取同行的单元格
        const rowCells = [];
        for (let c = 0; c < 9; c++) {
            if (c !== col && board[row][c] === 0) {
                const candidates = this.getCandidates(board, row, c);
                if (candidates && candidates.length === 2) {  // 只收集有两个候选数字的单元格
                    rowCells.push({ row, col: c, candidates });
                }
            }
        }

        // 获取同列的单元格
        const colCells = [];
        for (let r = 0; r < 9; r++) {
            if (r !== row && board[r][col] === 0) {
                const candidates = this.getCandidates(board, r, col);
                if (candidates && candidates.length === 2) {  // 只收集有两个候选数字的单元格
                    colCells.push({ row: r, col, candidates });
                }
            }
        }

        // 获取同宫格的单元格
        const boxStartRow = Math.floor(row / 3) * 3;
        const boxStartCol = Math.floor(col / 3) * 3;
        const boxCells = [];
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const currentRow = boxStartRow + r;
                const currentCol = boxStartCol + c;
                if ((currentRow !== row || currentCol !== col) && board[currentRow][currentCol] === 0) {
                    const candidates = this.getCandidates(board, currentRow, currentCol);
                    if (candidates && candidates.length === 2) {  // 只收集有两个候选数字的单元格
                        boxCells.push({ row: currentRow, col: currentCol, candidates });
                    }
                }
            }
        }

        console.log('Found cells with 2 candidates:', {
            row: rowCells,
            col: colCells,
            box: boxCells
        });

        // 在同行中查找赤裸对
        for (let i = 0; i < rowCells.length - 1; i++) {
            for (let j = i + 1; j < rowCells.length; j++) {
                const cell1 = rowCells[i];
                const cell2 = rowCells[j];
                if (cell1.candidates[0] === cell2.candidates[0] && 
                    cell1.candidates[1] === cell2.candidates[1]) {
                    // 找到赤裸对，从当前单元格的候选数字中移除这两个数字
                    const remainingCandidates = currentCandidates.filter(
                        n => n !== cell1.candidates[0] && n !== cell1.candidates[1]
                    );
                    if (remainingCandidates.length < currentCandidates.length) {
                        return {
                            found: true,
                            value: remainingCandidates,
                            description: `Found naked pair ${cell1.candidates.join(',')} in row ${row + 1} at columns ${cell1.col + 1} and ${cell2.col + 1}`
                        };
                    }
                }
            }
        }

        // 在同列中查找赤裸对
        for (let i = 0; i < colCells.length - 1; i++) {
            for (let j = i + 1; j < colCells.length; j++) {
                const cell1 = colCells[i];
                const cell2 = colCells[j];
                if (cell1.candidates[0] === cell2.candidates[0] && 
                    cell1.candidates[1] === cell2.candidates[1]) {
                    // 找到赤裸对，从当前单元格的候选数字中移除这两个数字
                    const remainingCandidates = currentCandidates.filter(
                        n => n !== cell1.candidates[0] && n !== cell1.candidates[1]
                    );
                    if (remainingCandidates.length < currentCandidates.length) {
                        return {
                            found: true,
                            value: remainingCandidates,
                            description: `Found naked pair ${cell1.candidates.join(',')} in column ${col + 1} at rows ${cell1.row + 1} and ${cell2.row + 1}`
                        };
                    }
                }
            }
        }

        // 在同宫格中查找赤裸对
        for (let i = 0; i < boxCells.length - 1; i++) {
            for (let j = i + 1; j < boxCells.length; j++) {
                const cell1 = boxCells[i];
                const cell2 = boxCells[j];
                if (cell1.candidates[0] === cell2.candidates[0] && 
                    cell1.candidates[1] === cell2.candidates[1]) {
                    // 找到赤裸对，从当前单元格的候选数字中移除这两个数字
                    const remainingCandidates = currentCandidates.filter(
                        n => n !== cell1.candidates[0] && n !== cell1.candidates[1]
                    );
                    if (remainingCandidates.length < currentCandidates.length) {
                        return {
                            found: true,
                            value: remainingCandidates,
                            description: `Found naked pair ${cell1.candidates.join(',')} in box at positions (${cell1.row + 1},${cell1.col + 1}) and (${cell2.row + 1},${cell2.col + 1})`
                        };
                    }
                }
            }
        }

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
