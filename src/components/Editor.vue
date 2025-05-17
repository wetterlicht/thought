<template>
    <div class="max-w-3xl mx-auto">
        <div class="min-h-28 group flex flex-col justify-end">
            <button v-if="currentPage?.icon" @click="showEmojiPicker = !showEmojiPicker"
                class="w-fit text-5xl leading-normal mt-24 mb-2 hover:bg-stone-100 rounded aspect-square cursor-pointer">{{
                    currentPage?.icon
                }}</button>
            <div class="relative">
                <div class="mb-2 invisible group-hover:visible group-focus-within:visible flex gap-2">
                    <button @click="() => showEmojiPicker = true"
                        class="flex items-center gap-1 text-sm text-stone-600 hover:text-black hover:bg-stone-100 rounded-md px-2 py-1 cursor-pointer">
                        <FaceSmileIcon class="size-5"></FaceSmileIcon>Add icon
                    </button>
                    <button
                        class="flex items-center gap-1 text-sm text-stone-600 hover:text-black hover:bg-stone-100 rounded-md px-2 py-1 cursor-pointer">
                        <PhotoIcon class="size-5"></PhotoIcon>Add cover
                    </button>
                </div>
                <EmojiPicker class="absolute top-0" v-show="showEmojiPicker"
                    @select="(emoji: string) => { setPageIcon(emoji); showEmojiPicker = false }"
                    @remove="() => { setPageIcon(''); showEmojiPicker = false }" />
            </div>
        </div>
        <h1 class="text-4xl font-bold mb-4 px-[3px] py-[2px]" ref="pageTitleElement" placeholder="Page Title"
            contenteditable="true" @input="saveTitle"
            @keydown.enter.prevent="() => insertBlockAtIndex(currentPage!.blockListId, 'Text', 0)">
            {{ pageTitle }}
        </h1>
        <BlockList :blockListId="currentPage!.blockListId"></BlockList>
        <BlockMenu />
    </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';
import BlockMenu from '@/components/BlockMenu.vue';
import { useRepo } from '@/composables/useRepo';
import BlockList from './BlockList.vue';
import { FaceSmileIcon, PhotoIcon } from "@heroicons/vue/24/outline";
import EmojiPicker from './EmojiPicker.vue';

const { currentPage, insertBlockAtIndex, setPageTitle, setPageIcon } = useRepo();

const pageTitle = ref(currentPage.value?.title);
const pageTitleElement: Ref<HTMLElement | undefined> = ref();
const showEmojiPicker = ref(false);

const saveTitle = (event: Event) => {
    const element = (event.target as HTMLElement);
    setPageTitle(element.innerText);
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