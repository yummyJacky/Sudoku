<script>
import { strategyHint } from '@sudoku/stores/strategy';
import { STRATEGIES } from '@sudoku/stores/strategy';
import { cursor } from '@sudoku/stores/cursor';
import { userGrid } from '@sudoku/stores/grid';

const switchStrategy = () => {
    const strategies = Object.keys(STRATEGIES);
    const currentIndex = strategies.findIndex(key => STRATEGIES[key].name === $strategyHint.strategy.name);
    const nextIndex = (currentIndex + 1) % strategies.length;
    const nextStrategy = strategies[nextIndex];
    strategyHint.setHint(nextStrategy, $cursor);
    userGrid.applyHint($cursor,$strategyHint.strategy); 
}
</script>

{#if $strategyHint.strategy}
    <div class="strategy-hint">
        <div class="strategy-header">
            <div class="strategy-name">
                Strategy: {$strategyHint.strategy.name}
            </div>
            <button 
                class="switch-btn"
                on:click={switchStrategy}
            >
                Switch Strategy
            </button>
        </div>
        <div class="strategy-desc">
            {$strategyHint.strategy.description}
        </div>
        {#if $strategyHint.position}
            <div class="strategy-position">
                Position: Row {$strategyHint.position.row + 1}, Column {$strategyHint.position.col + 1}
                {#if $strategyHint.value}
                    <span class="strategy-value">→ {$strategyHint.value}</span>
                {/if}
            </div>
        {/if}
    </div>
{/if}

<style>
    .strategy-hint {
        @apply bg-gray-100 rounded-xl p-3 mt-3;
    }

    .strategy-header {
        @apply flex justify-between items-center;
    }

    .strategy-name {
        @apply font-semibold text-primary text-lg;
    }

    .strategy-desc {
        @apply text-gray-600 text-sm mt-1;
    }

    .switch-btn {
        @apply bg-primary text-white px-3 py-1 rounded-lg text-sm transition-colors;
    }
    
    .switch-btn:hover {
        @apply bg-blue-600;
    }
    .strategy-position {
        @apply text-gray-600 text-sm mt-1 font-mono;
    }

    .strategy-value {
        @apply ml-2 font-bold text-primary;
    }
</style>
