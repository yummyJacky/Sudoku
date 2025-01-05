export const BASIC_ELIMINATION = {
    name: 'simple strategy',
    description: '检查同行、同列和同宫格中的数字，排除已经使用的数字',
    effect: (grid) => {
        console.log('使用基本消除策略')
        return []
    },
}