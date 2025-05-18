<template>
    <ul class="w-full flex flex-col gap-y-px">
        <li v-for="page in pages" :key="page.id" class="w-full">

            <div class="group relative">
                <RouterLink :to="`/workspaces/${workspaceId}/pages/${page.id}`" class="cursor-default text-stone-600 hover:text-black
                hover:bg-stone-200 block rounded-lg leading-6 px-2 py-1.5">
                    <div class="flex items-center gap-1" :style="{ 'margin-left': `${depth * 0.5}rem` }">
                        <div v-if="page.icon">{{ page.icon }}</div>
                        <DocumentTextIcon class="size-5 shrink-0" v-else></DocumentTextIcon>
                        <div class="truncate flex-grow">{{ page.title }}</div>
                    </div>
                </RouterLink>
                <button @click.stop="createPageInPage(page.id)"
                    class="absolute right-1 top-1 text-stone-600 
                    opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:text-black hover:bg-stone-300 rounded-md p-1">
                    <DocumentPlusIcon class="size-5"></DocumentPlusIcon>
                </button>
            </div>
            <PageList v-if="page.children" :workspaceId="workspaceId" :pages="page.children" :depth="depth + 1">
            </PageList>
        </li>
    </ul>
</template>

<script setup lang="ts">
import { DocumentTextIcon, DocumentPlusIcon } from "@heroicons/vue/24/outline";
import type { PageDocumentWithId } from '@/types';
import { useRepo } from '@/composables/useRepo';

const { createPageInPage } = useRepo();

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    },
    pages: {
        type: Array<PageDocumentWithId>,
        required: true
    },
    depth: {
        type: Number,
        default: 0
    }
})
</script>

<style scoped>
.router-link-active {
    color: var(--color-black);
    background-color: var(--color-stone-200);
}
</style>