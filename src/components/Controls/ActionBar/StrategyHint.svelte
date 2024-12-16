<script>
import { strategyHint } from '@sudoku/stores/strategy';
</script>

{#if $strategyHint.strategy}
    <div class="strategy-hint">
        <div class="strategy-name">
            Strategy:{$strategyHint.strategy.name}
        </div>
        <div class="strategy-desc">
            {$strategyHint.strategy.description}
        </div>
    </div>
{/if}

<style>
    .strategy-hint {
        @apply bg-gray-100 rounded-xl p-3 mt-3;
    }

    .strategy-name {
        @apply font-semibold text-primary text-lg;
    }

    .strategy-desc {
        @apply text-gray-600 text-sm mt-1;
    }
</style>
