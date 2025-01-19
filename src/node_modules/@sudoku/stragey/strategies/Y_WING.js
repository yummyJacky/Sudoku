export const Y_WING = {
    name: 'Y-Wing',
    description: '枢纽格有两个候选数，每个翼格也有两个候选数，且枢纽格分别与两个翼格共享一个不同的候选数。当两个翼格都包含相同的第三个候选数时，可以从同时看到两个翼格的单元格中删除这个候选数。',
    effect: (grid) => {
        const result = {
            grid: grid.map(row => [...row]),
            changed: false,
            highlights: []
        }

        // 获取候选数表
        const candidatesMap = CandidateManager.getGridCandidates(grid)

        // 找到所有双值格
        const bivalueCells = YWingStrategy.findBivalueCells(grid, candidatesMap)

        // 寻找Y-Wing结构
        const wings = YWingStrategy.findYWings(bivalueCells)

        // 应用Y-Wing消除
        for (const wing of wings) {
            const { pivot, wing1, wing2, elimination } = wing

            // 检查所有格子
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    // 跳过已填数字的格子和Y-Wing结构中的格子
                    if (grid[row][col] !== 0 ||
                        (row === pivot.row && col === pivot.col) ||
                        (row === wing1.row && col === wing1.col) ||
                        (row === wing2.row && col === wing2.col)) {
                        continue
                    }

                    const key = `${col},${row}`
                    // 检查是否同时看到两个翼格
                    if (YWingStrategy.inSameUnit({ row, col }, wing1) &&
                        YWingStrategy.inSameUnit({ row, col }, wing2)) {

                        // 如果该格子包含要消除的候选数
                        if (candidatesMap[key] && candidatesMap[key].includes(elimination)) {
                            // 从候选数中移除
                            candidatesMap[key] = candidatesMap[key].filter(c => c !== elimination)
                            result.changed = true

                            // 添加高亮
                            result.highlights.push({
                                type: 'elimination',
                                cells: [
                                    { row, col, candidate: elimination },
                                    { row: pivot.row, col: pivot.col, candidates: pivot.candidates },
                                    { row: wing1.row, col: wing1.col, candidates: wing1.candidates },
                                    { row: wing2.row, col: wing2.col, candidates: wing2.candidates }
                                ]
                            })
                        }
                    }
                }
            }
        }

        return result
    }
}