<script>
import { strategyHint } from '@sudoku/stores/strategy';
</script>

{#if $strategyHint && $strategyHint.strategy}
    <div class="strategy-container">
        <div class="strategy-content">
            <div class="strategy-name">
                Strategy: {$strategyHint.strategy.name}
            </div>
            <div class="strategy-desc">
                {$strategyHint.strategy.description}
            </div>
        </div>
    </div>
{/if}

<style>
    .strategy-container {
        background-color: #f3f4f6;
        border-radius: 0.75rem;
        padding: 0.75rem;
        margin-top: 0.75rem;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .strategy-content {
        flex-grow: 1;
        margin-right: 1rem;
    }

    .strategy-name {
        font-weight: 600;
        color: #3b82f6;
        font-size: 1.125rem;
        line-height: 1.75rem;
    }

    .strategy-desc {
        color: #4b5563;
        font-size: 0.875rem;
        line-height: 1.25rem;
        margin-top: 0.25rem;
    }

</style>
