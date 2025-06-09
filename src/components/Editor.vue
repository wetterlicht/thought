<template>
    <div id="editor" class="max-w-3xl mx-auto px-8 pb-28">
        <div class="min-h-28 flex flex-col justify-end">
            <button v-if="currentPage?.icon" @click="showEmojiPicker"
                class="w-fit text-5xl leading-normal mt-24 hover:bg-stone-100 rounded aspect-square ">{{
                    currentPage?.icon
                }}</button>
            <div class="my-1">
                <div class="opacity-0 hover:opacity-100 focus-within:opacity-100 flex gap-2">
                    <button @click="showEmojiPicker"
                        class="flex items-center gap-1 text-sm text-stone-600 hover:text-black hover:bg-stone-100 rounded-md px-2 py-1 ">
                        <FaceSmileIcon class="size-5"></FaceSmileIcon>Add icon
                    </button>
                    <button
                        class="flex items-center gap-1 text-sm text-stone-600 hover:text-black hover:bg-stone-100 rounded-md px-2 py-1 ">
                        <PhotoIcon class="size-5"></PhotoIcon>Add cover
                    </button>
                </div>
                <dialog ref="emojiPickerDialog" class="m-auto bg-transparent shadow z-10"
                    v-on-click-outside="hideEmojiPicker">
                    <EmojiPicker @select="(emoji: string) => { setPageIcon(emoji); hideEmojiPicker() }"
                        @remove="() => { setPageIcon(''); hideEmojiPicker() }" @close="hideEmojiPicker" />
                </dialog>
            </div>
        </div>
        <h1 class="text-4xl font-bold mb-4 px-1 py-[2px]" ref="pageTitleElement" placeholder="Page Title"
            contenteditable="true" @input="saveTitle" @keydown.enter.prevent="onInsertFirstBlock">
            {{ pageTitle }}
        </h1>
        <div class="-translate-x-7">
            <BlockList ref="blockList" :blockListId="currentPage!.blockListId" @focusPrevious="onFocusPageTitle">
            </BlockList>
        </div>
        <button class="h-8 w-full cursor-text" @click="onInsertBlockAtEnd">
            <span class="sr-only">Insert new block</span>
        </button>
    </div>
</template>

<script setup lang="ts">
import { nextTick, type Ref, ref } from 'vue';
import { useRepo } from '@/composables/useRepo';
import BlockList from './BlockList.vue';
import { FaceSmileIcon, PhotoIcon } from "@heroicons/vue/24/outline";
import EmojiPicker from './EmojiPicker.vue';
import { vOnClickOutside } from '@vueuse/components'

const { currentPage, insertBlockAtIndex, insertBlockAtEnd, setPageTitle, setPageIcon } = useRepo();

const pageTitle = ref(currentPage.value?.title);
const pageTitleElement: Ref<HTMLElement | undefined> = ref();
const emojiPickerDialog = ref<HTMLDialogElement | undefined>(undefined);
const showEmojiPicker = () => {
    if (emojiPickerDialog.value) {
        emojiPickerDialog.value.show();
    }
}
const hideEmojiPicker = () => {
    if (emojiPickerDialog.value) {
        emojiPickerDialog.value.close();
    }
}

const saveTitle = (event: Event) => {
    const element = (event.target as HTMLElement);
    setPageTitle(element.innerText);
}

const blockList = ref();

const onInsertFirstBlock = () => {
    if (currentPage.value?.blockListId) {
        insertBlockAtIndex(currentPage.value.blockListId, 'Text', 0);
        nextTick(() => blockList.value.focusFirstBlock());
    }
}

const onInsertBlockAtEnd = () => {
    if (currentPage.value?.blockListId) {
        insertBlockAtEnd(currentPage.value.blockListId, 'Text');
        nextTick(() => blockList.value.focusLastBlock());
    }
}

const onFocusPageTitle = () => {
    nextTick(() => {
        if (pageTitleElement.value) {
            pageTitleElement.value.focus();
            const range = document.createRange();
            range.selectNodeContents(pageTitleElement.value);
            range.collapse(false);

            const sel = window.getSelection();
            if (sel) {
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }
    });
}
</script>

<style scoped>
h1[contentEditable=true]:empty:before {
    content: attr(placeholder);
    opacity: 0.6;
}

h1[contentEditable=true]:focus {
    outline: none;
}
</style>