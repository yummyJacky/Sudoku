<script>
	import { candidates as candidatesStore } from '@sudoku/stores/candidates';
	export let candidates = [];
	export let cellX;
	export let cellY;

	// 获取高亮信息
	$: highlights = $candidatesStore.highlights || {};
	$: cellKey = `${cellX-1},${cellY-1}`;
</script>

<div class="candidates">
	{#each [1, 2, 3, 4, 5, 6, 7, 8, 9] as n}
		<div 
			class="candidate" 
			class:eliminated={highlights[cellKey]?.[n] === 'eliminated'}
			class:xwing={highlights[cellKey]?.[n] === 'xwing'}
		>
			{#if candidates.includes(n)}
				{n}
			{/if}
		</div>
	{/each}
</div>

<style>
	.candidates {
		@apply grid grid-cols-3 grid-rows-3 h-full w-full text-xs;
	}

	@media (min-width: 300px) {
		.candidates {
			@apply text-sm;
		}
	}

	@media (min-width: 400px) {
		.candidates {
			@apply text-base;
		}
	}

	@media (min-width: 500px) {
		.candidates {
			@apply text-lg;
		}
	}

	.candidate {
		@apply flex items-center justify-center;
	}

	.eliminated {
		@apply bg-red-200;  /* 浅红色背景表示要删除的候选数 */
	}

	.xwing {
		@apply bg-blue-200;  /* 浅蓝色背景表示X-Wing模式的四个角 */
	}
</style>