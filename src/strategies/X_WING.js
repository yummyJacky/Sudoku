export const X_WING = {
    name: 'X-Wing',
    description: '当两行（或两列）中，某个候选数仅出现在相同的两列（或两行）时，这四个单元格形成X-Wing结构。此时，可以排除其他行或列中相同位置的该候选数。',
    effect: (grid) => {
        // 获取当前的候选数
        const candidatesMap = {}
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const candidates = []
                    for (let num = 1; num <= 9; num++) {
                        let canPlace = true
                        // 检查行
                        for (let x = 0; x < 9; x++) {
                            if (grid[row][x] === num) {
                                canPlace = false
                                break
                            }
                        }
                        // 检查列
                        if (canPlace) {
                            for (let y = 0; y < 9; y++) {
                                if (grid[y][col] === num) {
                                    canPlace = false
                                    break
                                }
                            }
                        }
                        // 检查3x3方格
                        if (canPlace) {
                            const boxRow = Math.floor(row / 3) * 3
                            const boxCol = Math.floor(col / 3) * 3
                            for (let y = boxRow; y < boxRow + 3; y++) {
                                for (let x = boxCol; x < boxCol + 3; x++) {
                                    if (grid[y][x] === num) {
                                        canPlace = false
                                        break
                                    }
                                }
                                if (!canPlace) break
                            }
                        }
                        if (canPlace) {
                            candidates.push(num)
                        }
                    }
                    if (candidates.length > 0) {
                        candidatesMap[`${col},${row}`] = candidates
                    }
                }
            }
        }

        // 查找X-Wing模式
        const rowPatterns = XWingStrategy.findRowXWing(grid, candidatesMap)
        const colPatterns = XWingStrategy.findColXWing(grid, candidatesMap)

        // 返回找到的第一个有效模式
        const allPatterns = [...rowPatterns, ...colPatterns]
        if (allPatterns.length > 0) {
            return allPatterns[0].changes
        }

        return []
    }
}