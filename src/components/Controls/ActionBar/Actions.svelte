<script>
	import { candidates } from '@sudoku/stores/candidates';
	import { userGrid } from '@sudoku/stores/grid';
	import { cursor } from '@sudoku/stores/cursor';
	import { hints } from '@sudoku/stores/hints';
	import { notes } from '@sudoku/stores/notes';
	import { settings } from '@sudoku/stores/settings';
	import { keyboardDisabled } from '@sudoku/stores/keyboard';
	import { gamePaused } from '@sudoku/stores/game';
	import { strategyHint } from '@sudoku/stores/strategy';
	import StrategyHint from './StrategyHint.svelte';
	import { BasicEliminationStrategy } from '../../Strategies/BasicEliminationStrategy';
	import { NakedPairsStrategy } from '../../Strategies/NakedPairsStrategy';

	$: hintsAvailable = $hints > 0;
	$: cursorValid = $cursor.x !== null && $cursor.y !== null;
	$: cursorCellEmpty = cursorValid && $userGrid[$cursor.y][$cursor.x] === 0;

	const basicEliminationStrategy = new BasicEliminationStrategy();
	const nakedPairsStrategy = new NakedPairsStrategy();

	function handleHint() {
		console.log('Hint button clicked');
		console.log('Cursor:', $cursor);
		console.log('Cursor cell value:', $userGrid[$cursor.y][$cursor.x]);
		console.log('Hints available:', hintsAvailable);
		console.log('Cursor valid:', cursorValid);
		console.log('Cursor cell empty:', cursorCellEmpty);

		if (hintsAvailable && cursorValid && cursorCellEmpty) {
			// 使用一次提示
			hints.useHint();
			
			console.log('Applying strategies...');
			
			// 清除之前的候选数字
			candidates.clear($cursor);
			
			// 首先尝试赤裸对策略
			console.log('Trying naked pairs strategy...');
			let result = nakedPairsStrategy.apply($userGrid, $cursor.y, $cursor.x);
			let currentStrategy = nakedPairsStrategy;
			
			// 如果赤裸对策略没有找到解，尝试基本消除策略
			if (!result.found) {
				console.log('Naked pairs not found, trying basic elimination...');
				result = basicEliminationStrategy.apply($userGrid, $cursor.y, $cursor.x);
				currentStrategy = basicEliminationStrategy;
			}

			// 设置使用的策略信息
			strategyHint.setHint('BASIC_ELIMINATION', $cursor);
			// 实际调用策略
			userGrid.applyHint($cursor,$strategyHint.strategy);
			console.log('Strategy result:', result);
			
			if (result.found) {
				console.log('Strategy found values:', result.value);
				console.log('Using strategy:', currentStrategy.name);
				
				strategyHint.setHint(
					currentStrategy,
					{ row: $cursor.y, col: $cursor.x }, 
					result.value
				);
				
				// 如果只有一个可能的值，自动填入
				if (Array.isArray(result.value) && result.value.length === 1) {
					userGrid.applyHint({ x: $cursor.x, y: $cursor.y }, result.value[0]);
				}
				// 如果有多个可能的值，更新候选数字
				else if (Array.isArray(result.value) && result.value.length > 1) {
					candidates.setAll($cursor, result.value);
				}
			} else {
				console.log('No strategy found any values');
				strategyHint.clear();
			}
		} else {
			console.log('Cannot apply hint:');
			console.log('- Hints available:', hintsAvailable);
			console.log('- Cursor valid:', cursorValid);
			console.log('- Cursor cell empty:', cursorCellEmpty);
		}
	}

	function handleUndo() {
		strategyHint.clear();
		userGrid.undo();
	}

	function handleRedo() {
		strategyHint.clear();
		userGrid.redo();
	}

	function handleReset() {
		strategyHint.clear();
		userGrid.reset();
	}

	// 监听 userGrid 的变化
	$: {
		if ($userGrid) {
			// 当数独板变化时，清除提示和候选数字
			strategyHint.clear();
			if ($cursor.x !== null && $cursor.y !== null) {
				candidates.clear($cursor);
			}
		}
	}
</script>

<div class="action-buttons space-x-3">

	<button class="btn btn-round" disabled={$gamePaused} title="Undo" on:click={handleUndo}>
		<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
		</svg>
	</button>

	<button class="btn btn-round" disabled={$gamePaused} title="Redo" on:click={handleRedo}>
		<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10h-10a8 8 90 00-8 8v2M21 10l-6 6m6-6l-6-6" />
		</svg>
	</button>

	<button class="btn btn-round" disabled={$gamePaused} title="Reset" on:click={handleReset}>
		<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
		</svg>
	</button>

	<button class="btn btn-round btn-badge" disabled={$keyboardDisabled || !hintsAvailable || !cursorValid || !cursorCellEmpty} on:click={handleHint} title="Hints ({$hints})">
		<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
		</svg>

		{#if $settings.hintsLimited}
			<span class="badge" class:badge-primary={hintsAvailable}>{$hints}</span>
		{/if}
	</button>

	<button class="btn btn-round btn-badge" on:click={notes.toggle} title="Notes ({$notes ? 'ON' : 'OFF'})">
		<svg class="icon-outline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
		</svg>

		<span class="badge tracking-tighter" class:badge-primary={$notes}>{$notes ? 'ON' : 'OFF'}</span>
	</button>

</div>

<StrategyHint />


<style>
	.action-buttons {
		@apply flex flex-wrap justify-evenly self-end;
	}

	.btn-badge {
		@apply relative;
	}

	.badge {
		min-height: 20px;
		min-width:  20px;
		@apply p-1 rounded-full leading-none text-center text-xs text-white bg-gray-600 inline-block absolute top-0 left-0;
	}

	.badge-primary {
		@apply bg-primary;
	}
</style>