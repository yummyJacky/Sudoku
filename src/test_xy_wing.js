// XY-Wing策略测试

class XYWingStrategy {
    // 查找双值格
    static findBivalueCells(grid, candidatesMap) {
        const bivalueCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                const key = `${row},${col}`;
                if (candidatesMap[key] && candidatesMap[key].length === 2) {
                    bivalueCells.push({
                        row,
                        col,
                        candidates: candidatesMap[key]
                    });
                }
            }
        }
        return bivalueCells;
    }

    // 检查两个格子是否在同一单元（行、列或宫）
    static inSameUnit(cell1, cell2) {
        return cell1.row === cell2.row || 
               cell1.col === cell2.col || 
               (Math.floor(cell1.row / 3) === Math.floor(cell2.row / 3) && 
                Math.floor(cell1.col / 3) === Math.floor(cell2.col / 3));
    }

    // 获取两个格子共享的候选数
    static getSharedCandidate(cell1, cell2) {
        return cell1.candidates.find(c => cell2.candidates.includes(c));
    }

    // 查找XY-Wing结构
    static findXYWings(bivalueCells) {
        const wings = [];
        for (let i = 0; i < bivalueCells.length; i++) {
            const pivot = bivalueCells[i];
            for (let j = 0; j < bivalueCells.length; j++) {
                if (i === j) continue;
                const wing1 = bivalueCells[j];
                if (!this.inSameUnit(pivot, wing1)) continue;
                
                const shared1 = this.getSharedCandidate(pivot, wing1);
                if (!shared1) continue;

                for (let k = 0; k < bivalueCells.length; k++) {
                    if (k === i || k === j) continue;
                    const wing2 = bivalueCells[k];
                    if (!this.inSameUnit(pivot, wing2)) continue;

                    const shared2 = this.getSharedCandidate(pivot, wing2);
                    if (!shared2 || shared1 === shared2) continue;

                    // 检查两个翼格是否共享第三个候选数
                    const elimination = this.getSharedCandidate(wing1, wing2);
                    if (!elimination || elimination === shared1 || elimination === shared2) continue;

                    wings.push({
                        pivot,
                        wing1,
                        wing2,
                        elimination
                    });
                }
            }
        }
        return wings;
    }

    // 策略效果实现
    static effect(grid, candidatesMap) {
        // 找到所有双值格
        const bivalueCells = this.findBivalueCells(grid, candidatesMap);
        
        // 查找XY-Wing结构
        const wings = this.findXYWings(bivalueCells);
        
        if (wings.length === 0) {
            return {
                changed: false,
                eliminations: [],
                highlights: []
            };
        }

        // 对每个XY-Wing结构进行处理
        const eliminations = [];
        const highlights = [];
        
        for (const wing of wings) {
            // 高亮显示相关格子
            highlights.push(
                { row: wing.pivot.row, col: wing.pivot.col, type: 'pivot' },
                { row: wing.wing1.row, col: wing.wing1.col, type: 'wing' },
                { row: wing.wing2.row, col: wing.wing2.col, type: 'wing' }
            );

            // 查找可以消除候选数的格子
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    const cell = { row, col };
                    // 如果格子能同时看到两个翼格
                    if (this.inSameUnit(cell, wing.wing1) && 
                        this.inSameUnit(cell, wing.wing2)) {
                        const key = `${row},${col}`;
                        if (candidatesMap[key] && 
                            candidatesMap[key].includes(wing.elimination)) {
                            eliminations.push({
                                row,
                                col,
                                candidate: wing.elimination
                            });
                        }
                    }
                }
            }
        }

        return {
            changed: eliminations.length > 0,
            eliminations,
            highlights
        };
    }
}

// 测试用例
function runTests() {
    console.log("开始测试 XY-Wing 策略...\n");

    // 测试1：基本的XY-Wing模式
    console.log("测试1：基本的XY-Wing模式");
    const grid1 = [
        [1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0]
    ];

    const candidates1 = {
        '1,1': [2, 7],  // pivot
        '1,3': [2, 9],  // wing1
        '1,5': [7, 9],  // wing2
        '1,4': [3, 9]   // 应该被消除的9
    };

    const result1 = XYWingStrategy.effect(grid1, candidates1);
    console.log("找到的XY-Wing结构数量:", result1.highlights.length / 3);
    console.log("消除的候选数数量:", result1.eliminations.length);
    console.log("消除详情:", result1.eliminations);
    console.log("策略是否生效:", result1.changed);
    console.log("\n");

    // 测试2：无效的XY-Wing模式
    console.log("测试2：无效的XY-Wing模式");
    const candidates2 = {
        '1,1': [1, 2],
        '1,2': [2, 3],
        '1,3': [3, 4]
    };

    const result2 = XYWingStrategy.effect(grid1, candidates2);
    console.log("找到的XY-Wing结构数量:", result2.highlights.length / 3);
    console.log("消除的候选数数量:", result2.eliminations.length);
    console.log("策略是否生效:", result2.changed);
    console.log("\n");

    // 测试3：多个可消除的候选数
    console.log("测试3：多个可消除的候选数");
    const candidates3 = {
        '1,1': [2, 7],  // pivot
        '1,3': [2, 9],  // wing1
        '1,5': [7, 9],  // wing2
        '1,4': [3, 9],  // 应该被消除的9
        '1,2': [4, 9]   // 另一个应该被消除的9
    };

    const result3 = XYWingStrategy.effect(grid1, candidates3);
    console.log("找到的XY-Wing结构数量:", result3.highlights.length / 3);
    console.log("消除的候选数数量:", result3.eliminations.length);
    console.log("消除详情:", result3.eliminations);
    console.log("策略是否生效:", result3.changed);
}

// 运行测试
runTests();
