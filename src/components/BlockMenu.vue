<template>
    <div class="block-menu" @keydown="onKeydown" v-on-click-outside="() => emit('close')" :class="{
        '-translate-y-full': showAbove,
        'top-0': !showAbove,
    }">
        <div class="overflow-y-auto max-h-[min(500px_40vh)]">
            <input ref="input" v-model="menuQuery" type="text" placeholder="Search blocks..."
                class="w-full px-2 py-1 mb-2 border border-stone-300 rounded-md" />
            <div v-for="section in filteredSections" class="block-menu__section">
                <div class="block-menu__section-title">{{ section.name }}</div>
                <ul>
                    <li v-for="block in section.blocks" :data-block-name="block.name"
                        :class="{ active: selectedBlock.name === block.name }">
                        <button @click="onBlockClicked(block.name)">{{
                            block.name }}</button>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { vOnClickOutside } from '@vueuse/components'

const emit = defineEmits(['confirmSelection', 'close']);

const input = ref();
const showAbove = ref(false);
const menuQuery = ref('');
const selectionIndex = ref(0);

onMounted(() => {
    // Show the menu above the block if in the lower half of the screen
    const rect = input.value.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    if (rect.bottom > viewportHeight / 2) {
        showAbove.value = true;
    } else {
        showAbove.value = false;
    }
    nextTick(() => {
        if (input.value) {
            input.value.focus();
        }
    });
});

const sections = [
    {
        name: "Basic blocks",
        blocks: [
            {
                name: "Text"
            },
            {
                name: "Heading 1"
            },
            {
                name: "Heading 2"
            },
            {
                name: "Heading 3"
            },
            {
                name: "Image"
            },
            {
                name: "Bulleted list"
            },
            {
                name: "Numbered list"
            },
            {
                name: "Todo list"
            },
            {
                name: "Callout"
            },
            {
                name: 'Page'
            }
        ]
    },
];



function moveSelection(direction: 1 | -1) {
    selectionIndex.value = (selectionIndex.value + direction + filteredBlocks.value.length) % filteredBlocks.value.length
}

function confirmSelection() {
    if (filteredBlocks.value.length > 0) {
        const type = filteredBlocks.value[selectionIndex.value]?.name;
        if (!type) {
            return;
        }
        emit('confirmSelection', type);
    }
}

const filteredSections = computed(() => {
    const result: { name: string, blocks: { name: string }[] }[] = [];
    sections.forEach(section => {
        const blocks = section.blocks.filter(block => {
            const filter = menuQuery.value.toLowerCase();
            return block.name.toLowerCase().includes(filter);
        })
        if (blocks.length > 0) {
            result.push({
                ...section,
                blocks
            })
        }
    })
    return result;
})

const filteredBlocks = computed(() => {
    return filteredSections.value.reduce((acc, cur) => {
        acc.push(...cur.blocks);
        return acc;
    }, [] as { name: string }[]);
})

const selectedBlock = computed(() => {
    return filteredBlocks.value[selectionIndex.value]
})

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        emit('close');
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

const onBlockClicked = (blockName: string) => {
    emit('confirmSelection', blockName);
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
    position: absolute;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    width: 20rem;
    max-width: calc(100% - 2rem);
    padding-inline: 0.5rem;
    padding-block: 0.5rem;
    z-index: 10;
    background-color: white;

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