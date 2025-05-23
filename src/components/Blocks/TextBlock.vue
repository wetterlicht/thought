<template>
    <p spellcheck="false" ref="editable" placeholder="Write, or press ‘/’ to add a block &hellip;"
        :contenteditable="true" @input="onInput" @blur="onBlur" @keydown="onKeydown" class="leading-6">
        <InlineSegment v-for="segment in content" :segment="segment"></InlineSegment>
    </p>
</template>

<script setup lang="ts">
import { type PropType, type Ref, ref } from 'vue';
import { useBlockMenu } from '@/composables/useBlockMenu';
import InlineSegment from '@/components/InlineSegment.vue';
import { useRepo } from '@/composables/useRepo';
import type { Segment } from '@/types';

const props = defineProps({
    id: {
        type: String,
        required: true
    },
    data: {
        type: Object as PropType<{ content: [Segment] }>,
        required: true
    },
})

const content = ref(props.data.content);

const { updateBlockData } = useRepo();

const emit = defineEmits(['blockSelected', 'newBlock', 'focusPrevious', 'focusNext', 'deleteBlock']);

const editable: Ref<HTMLElement | null> = ref(null)

function focusBlock(focusStart: boolean) {
    if (editable.value === null) {
        return;
    }

    editable.value.focus()
    const range = document.createRange();
    range.selectNodeContents(editable.value);
    range.collapse(focusStart);

    const sel = window.getSelection();
    if (sel) {
        sel.removeAllRanges();
        sel.addRange(range);
    }
}

defineExpose({ focusBlock })

const { canOpenMenu, menuOpen, selectedBlock, openMenu, updateQuery, closeMenu, moveSelection } = useBlockMenu();

const previousKey = ref();

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && menuOpen.value) {
        closeMenu();
    } else if (event.key === 'Enter') {
        if (previousKey.value === 'Shift') {
            return;
        }
        if (menuOpen.value && editable.value) {
            event.preventDefault();
            closeMenu();
            emit('blockSelected', selectedBlock.value.name)
            editable.value.innerHTML = ''
        }
        else if (!menuOpen.value) {
            event.preventDefault();
            emit('newBlock')
        }

    } else if (event.key === 'ArrowDown') {
        if (menuOpen.value) {
            event.preventDefault();
            moveSelection(1);
        } else {
            if (isCaretAtEnd()) {
                event.preventDefault()
                emit('focusNext', props.id)
            }
        }
    } else if (event.key === 'ArrowUp') {
        if (menuOpen.value) {
            event.preventDefault();
            moveSelection(-1)
        } else {
            if (isCaretAtStart()) {
                event.preventDefault()
                emit('focusPrevious', props.id)
            }
        }
    } else if (event.key === 'Backspace') {
        if (editable.value?.innerText.length === 0) {
            event.preventDefault();
            emit('deleteBlock')
        }
    }
    previousKey.value = event.key
}

function isCaretAtStart() {
    if (!editable.value) {
        return;
    }
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) { return false; }

    const range = selection.getRangeAt(0);
    if (!editable.value.contains(range.startContainer)) return false;

    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editable.value);
    preCaretRange.setEnd(range.startContainer, range.startOffset);

    // If there's any text before the caret, then it's not at the start
    const preCaretContent = preCaretRange.cloneContents().textContent || '';
    return preCaretContent.trim().length === 0;
}

function isCaretAtEnd() {
    if (!editable.value) {
        return;
    }
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) { return false; }

    const range = selection.getRangeAt(0);
    if (!editable.value.contains(range.endContainer)) return false;

    const postCaretRange = range.cloneRange();
    postCaretRange.selectNodeContents(editable.value);
    postCaretRange.setStart(range.endContainer, range.endOffset);

    const postCaretContent = postCaretRange.cloneContents().textContent || '';
    return postCaretContent.trim().length === 0;
}


const onInput = (event: Event) => {
    const element = (event.target as HTMLElement);

    if (!menuOpen.value && canOpenMenu.value && element.innerText.startsWith('/')) {
        openMenu();
    }
    else if (menuOpen.value && !element.innerText.startsWith('/')) {
        closeMenu();
    }
    if (element.childNodes.length === 1 && element.childNodes[0].nodeName === 'BR') {
        if (menuOpen.value) {
            updateQuery('');
        }
        element.innerHTML = '';
        canOpenMenu.value = true;
    } else if (menuOpen.value) {
        updateQuery(element.innerText);
    }
    updateBlockData(
        props.id,
        {
            ...props.data,
            content: parseContent(element)
        })
}

const parseContent = (element: HTMLElement): Segment[] => {
    const segments: Segment[] = [];

    element.childNodes.forEach((node) => {
        const textContent = node.textContent || '';
        if (!textContent) {
            return;
        }
        if (node.nodeType === Node.TEXT_NODE) {
            segments.push({
                type: 'text',
                text: textContent,
                format: []
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const span = node as HTMLElement;
            const format: string[] = [];


            if (span.classList.contains('bold')) {
                format.push('bold');
            }
            if (span.classList.contains('italic')) {
                format.push('italic');
            }
            if (span.classList.contains('underline')) {
                format.push('underline');
            }
            if (span.classList.contains('strike')) {
                format.push('strike');
            }
            if (span.classList.contains('code')) {
                format.push('code');
            }

            segments.push({
                type: 'text',
                text: textContent,
                format: format
            });
        }
    });

    return segments;
};

const onBlur = () => {
    closeMenu();
}
</script>

<style scoped>
[contentEditable=true] {
    width: 100%;

    &:focus {
        outline: none;
    }
}

[contentEditable=true]:focus:empty:before,
[contentEditable=true]:only-child:empty:before {
    content: attr(placeholder);
    opacity: 0.6;
}
</style>