export const LAST_REMAINING_1 = {
    name: 'last remaining',
    description: '从未使用的数字中选择一个',
    effect: (grid) => {
        console.log('使用最后剩余策略', grid)

        return []
    }
}