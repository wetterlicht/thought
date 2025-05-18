<template>
    <li class="w-full">
        <div class="group relative">
            <RouterLink :to="`/workspaces/${workspaceId}/pages/${page.id}`" class="cursor-default text-stone-600 group-hover:text-black
                group-hover:bg-stone-200 block rounded-lg leading-6 px-2 py-1.5">
                <div class="flex items-center gap-1" :style="{ 'margin-left': `${depth * 0.75}rem` }">
                    <div v-if="page.icon">{{ page.icon }}</div>
                    <DocumentTextIcon class="size-5 shrink-0" v-else></DocumentTextIcon>
                    <div class="truncate flex-grow">{{ page.title }}</div>
                </div>
            </RouterLink>
            <button v-if="page.children.length" @click="showChildren = !showChildren"
                class="absolute right-15 top-1 h-7 w-7 flex items-center justify-center text-stone-600 
                    opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-black hover:bg-stone-300 rounded-md p-1">
                <ChevronRightIcon class="size-4" :class="{
                    'rotate-90': showChildren
                }"></ChevronRightIcon>
            </button>
            <button @click.stop="showMenu"
                class="absolute right-8 top-1 text-stone-600 
                    opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-black hover:bg-stone-300 rounded-md p-1">
                <EllipsisHorizontalIcon class="size-5"></EllipsisHorizontalIcon>
            </button>
            <button @click.stop="createPageInPage(page.id)"
                class="absolute right-1 top-1 text-stone-600 
                    opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-black hover:bg-stone-300 rounded-md p-1">
                <DocumentPlusIcon class="size-5"></DocumentPlusIcon>
            </button>
            <dialog ref="menu" class="m-auto shadow bg-transparent">
                <PageListMenu @delete="onDelete(page.id)"></PageListMenu>
            </dialog>
        </div>
        <PageList class="my-px" v-if="page.children && showChildren" :workspaceId="workspaceId" :pages="page.children"
            :depth="depth + 1">
        </PageList>
    </li>
</template>

<script setup lang="ts">
import { DocumentTextIcon, DocumentPlusIcon, ChevronRightIcon, EllipsisHorizontalIcon } from "@heroicons/vue/24/outline";
import { useRepo } from '@/composables/useRepo';
import { ref, type PropType } from "vue";
import PageList from './PageList.vue';
import type { AssembledPage } from "@/types";
import PageListMenu from "./PageListMenu.vue";
import type { AutomergeUrl } from "@automerge/automerge-repo";
const { createPageInPage, deletePage } = useRepo();

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
    page: {
        type: Object as PropType<AssembledPage>,
        required: true
    },
    depth: {
        type: Number,
        default: 0
    }
})

const menu = ref<HTMLDialogElement | null>(null);
const showChildren = ref(false);

const showMenu = () => {
    if (menu.value) {
        menu.value.showModal();
    }
}

const onDelete = (id: AutomergeUrl) => {
    if (menu.value) {
        menu.value.close();
    }
    deletePage(id);
}

</script>

<style scoped>
.router-link-active {
    color: var(--color-black);
    background-color: var(--color-stone-200);
}
</style>