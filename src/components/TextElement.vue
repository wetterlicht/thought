<template>
    <component :is="component" spellcheck="false" ref="editable"
        placeholder="Write, or press Ctrl+i to add a block &hellip;" :contenteditable="true" @input="onInput"
        @keydown="onKeydown" class="w-full focus-within:outline-0 leading-6">{{
            content }}</component>
</template>

<script setup lang="ts">
import { nextTick, ref, type Ref } from 'vue';

const props = defineProps({
    component: {
        type: String,
        default: 'div'
    },
    blockId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['insertBlockAfter', 'replaceBlock', 'newBlock', 'focusBlock', 'focusPrevious', 'focusNext', 'deleteBlock', 'updateContent', 'openBlockMenu']);

const editable: Ref<HTMLElement | null> = ref(null)

const onKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            return;
        }
        event.preventDefault();
        emit('newBlock')
    } else if (event.key === 'ArrowDown') {
        if (isCaretAtEnd()) {
            event.preventDefault()
            emit('focusNext')
        }
    } else if (event.key === 'ArrowUp') {
        if (isCaretAtStart()) {
            event.preventDefault()
            emit('focusPrevious')
        }
    } else if (event.ctrlKey && event.key === 'i') {
        event.preventDefault();
        emit('openBlockMenu', {
            selectionCallback: (type: string) => {
                if (isEmpty()) {
                    emit('replaceBlock', type);
                } else {
                    emit('insertBlockAfter', type);
                }
            }, closeCallback: () => {
                nextTick(() => {
                    emit('focusBlock');
                });
            }
        });
    } else if (event.key === 'Backspace') {
        if (isEmpty()) {
            event.preventDefault();
            emit('deleteBlock', props.blockId);
        }
    }
}

function isEmpty() {
    return editable.value?.innerText.length === 0 || editable.value?.innerText === '\n'
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

const onInput = (event: InputEvent) => {
    const element = (event.target as HTMLElement);
    emit('updateContent', element.innerText);
}
</script>

<style scoped></style>