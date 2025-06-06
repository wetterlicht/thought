<template>
    <div class="block-menu" v-if="menuOpen" @keydown="onKeydown" v-on-click-outside="closeMenu">
        <input ref="input" v-model="menuQuery" type="text" placeholder="Search blocks..."
            class="w-full px-2 py-1 mb-2 border border-stone-300 rounded-md" />
        <div v-for="section in filteredSections" class="block-menu__section">
            <div class="block-menu__section-title">{{ section.name }}</div>
            <ul>
                <li v-for="block in section.blocks" :data-block-name="block.name"
                    :class="{ active: selectedBlock.name === block.name }">
                    <button @click="confirmSelection">{{
                        block.name }}</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import { useBlockMenu } from '../composables/useBlockMenu';
import { vOnClickOutside } from '@vueuse/components'

const { menuQuery, menuOpen, selectedBlock, filteredSections, closeMenu, moveSelection, confirmSelection } = useBlockMenu();

const input = ref<HTMLInputElement | null>(null);

watch(menuOpen, (newMenuOpen) => {
    if (newMenuOpen) {
        nextTick(() => {
            if (input.value) {
                input.value.focus();
            }
        });
    }
});

const onKeydown = (event: KeyboardEvent) => {
    if (!menuOpen.value) {
        return;
    }
    if (event.key === 'Escape') {
        closeMenu();
    } else if (event.key === 'Enter') {
        event.preventDefault();
        confirmSelection();
    }
    else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveSelection(1);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveSelection(-1)
    }
}

watch(selectedBlock, (newSelectedBlock) => {
    if (selectedBlock.value) {
        const element = document.querySelector(`[data-block-name="${newSelectedBlock.name}"]`);
        if (element !== null) {
            scrollIntoViewIfNeeded(element as HTMLElement)
        }
    }
})

function scrollIntoViewIfNeeded(element: HTMLElement, margin: number = 30) {
    const container = getScrollableParent(element);
    if (!container) return;

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const offsetTop = elementRect.top - containerRect.top + container.scrollTop;
    const offsetBottom = offsetTop + element.offsetHeight;

    const containerTop = container.scrollTop;
    const containerBottom = containerTop + container.clientHeight;

    if (offsetTop - margin < containerTop) {
        container.scrollTo({ top: offsetTop - margin, behavior: 'smooth' });
    } else if (offsetBottom + margin > containerBottom) {
        container.scrollTo({ top: offsetBottom - container.clientHeight + margin, behavior: 'smooth' });
    }
}

function getScrollableParent(element: HTMLElement) {
    let parent = element.parentElement;

    while (parent) {
        const overflowY = window.getComputedStyle(parent).overflowY;
        const isScrollable = (overflowY === 'auto' || overflowY === 'scroll');
        if (isScrollable && parent.scrollHeight > parent.clientHeight) {
            return parent;
        }
        parent = parent.parentElement;
    }
}
</script>

<style scoped>
.block-menu {
    border: 1px solid #ccc;
    border-radius: 1rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    width: 20rem;
    max-width: calc(100% - 2rem);
    max-height: min(500px, 40vh);
    padding-inline: 0.5rem;
    padding-block: 0.5rem;
    overflow: auto;

    .block-menu__section:not(:last-child) {
        margin-bottom: 1rem;
    }

    .block-menu__section-title {
        font-size: 0.75rem;
        color: #6f6f6f;
        padding-inline: 4px;
        margin-bottom: 0.5rem;
        background-color: white;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        row-gap: 0.125rem;
        padding-bottom: 0.5rem;

        &:not(:last-child) {
            border-bottom: 1px solid #ccc;
        }

        li button {
            color: black;
            background-color: white;
            border: none;
            width: 100%;
            cursor: pointer;
            text-align: left;
            border-radius: 4px;
            padding: 0.25rem 0.5rem;
            font-size: 1rem;

            &:hover {
                background-color: #eee;
            }
        }

        li.active button {
            background-color: #eee;
        }
    }
}
</style>