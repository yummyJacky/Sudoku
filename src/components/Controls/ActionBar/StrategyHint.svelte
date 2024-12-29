<script>
import { strategyHint } from '@sudoku/stores/strategy';
import { STRATEGIES } from '@sudoku/stores/strategy';
import { cursor } from '@sudoku/stores/cursor';
import { userGrid } from '@sudoku/stores/grid';
import { writable } from 'svelte/store';
import { CandidateManager, XWingStrategy } from '@sudoku/stores/strategy';
import { onMount } from 'svelte';
import { hints } from '@sudoku/stores/hints';
import { candidates } from '@sudoku/stores/candidates';

const switchStrategy = () => {
    const strategies = Object.keys(STRATEGIES);
    const currentIndex = strategies.findIndex(key => STRATEGIES[key].name === $strategyHint.strategy.name);
    const nextIndex = (currentIndex + 1) % strategies.length;
    const nextStrategy = strategies[nextIndex];
    
    // ���֮ǰ�ĸ���
    candidates.clearHighlights();
    
    // �����²���
    strategyHint.setHint(nextStrategy, $cursor);
    
    // Ӧ�ò��ԣ�����������ʾ����
    const changes = STRATEGIES[nextStrategy].effect($userGrid);
    if (changes && changes.length > 0) {
        userGrid.applyStrategyChanges($userGrid, changes, candidates);
    }
    if($candidates.showCandidates){
        hints.useHint();
    }
}
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
        <div class="strategy-button">
            <button 
                class="switch-btn"
                on:click={switchStrategy}
            >
                Switch Strategy
            </button>
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

    .strategy-button {
        flex-shrink: 0;
        position: sticky;
        top: 0;
        right: 0;
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

    .switch-btn {
        background-color: #3b82f6;
        color: white;
        padding: 0.25rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        transition: background-color 0.2s;
        white-space: nowrap;
    }
    
    .switch-btn:hover {
        background-color: #2563eb;
    }
</style>
