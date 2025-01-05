export const SINGLE_CHOICE = {
    name: 'single choice',
    description: '填入唯一可能的数字',
    effect: (grid) => {
        console.log('使用单选策略')

        return []
    },
}