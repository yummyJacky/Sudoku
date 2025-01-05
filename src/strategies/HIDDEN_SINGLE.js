export const HIDDEN_SINGLE = {
    name: 'Hidden Single',
    description: '在某一行、列或宫格中，某个候选数只能出现在一个特定位置时，该候选数必须被填入。',
    effect: (grid) => {
        // console.log('执行Hidden Single策略...');
        // 获取候选数映射
        const candidatesMap = {}
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (grid[row][col] === 0) {
                    const key = `${col},${row}`
                    candidatesMap[key] = CandidateManager.getCandidates(grid, row, col)
                }
            }
        }
        // console.log('当前候选数映射:', candidatesMap);

        const changes = []
        const hiddenSingles = HiddenSingleStrategy.findHiddenSingles(grid, candidatesMap)

        // console.log('准备应用变更...');
        for (const hiddenSingle of hiddenSingles) {
            // console.log('处理Hidden Single:', hiddenSingle);
            changes.push({
                type: 'highlight_candidate',
                row: hiddenSingle.row,
                col: hiddenSingle.col,
                digit: hiddenSingle.candidate,
                highlightType: 'eliminated'
            })
        }

        // console.log('返回的变更:', changes);
        return changes
    }
}