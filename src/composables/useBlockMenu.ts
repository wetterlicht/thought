import { computed, ref } from 'vue';


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
        ]
    },
];

const menuOpen = ref(false);
const menuQuery = ref('');
const menuPosition = ref({ top: 0, left: 0 });
const selectionIndex = ref(0);
const canOpenMenu = ref(true);

function openMenu(query = '', position = { top: 0, left: 0 }) {
    if (menuOpen.value) {
        return;
    }
    menuOpen.value = true
    menuQuery.value = query
    menuPosition.value = position
    selectionIndex.value = 0
}

function closeMenu() {
    menuOpen.value = false
}

function updateQuery(newQuery: string) {
    menuQuery.value = newQuery
}

function moveSelection(direction: 1 | -1) {
    selectionIndex.value = (selectionIndex.value + direction + filteredBlocks.value.length) % filteredBlocks.value.length
}

const filteredSections = computed(() => {
    const result: { name: string, blocks: { name: string }[] }[] = [];
    sections.forEach(section => {
        const blocks = section.blocks.filter(block => {
            const filter = menuQuery.value.substring(1).toLowerCase();
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

export function useBlockMenu() {
    return {
        menuOpen,
        menuPosition,
        menuQuery,
        selectedBlock,
        canOpenMenu,
        filteredSections,
        openMenu,
        closeMenu,
        updateQuery,
        moveSelection
    }
}