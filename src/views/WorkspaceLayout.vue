<template>
    <div class="flex h-screen" v-if="currentWorkspace">
        <nav class="w-62 bg-stone-100 border-r border-stone-200 p-4">
            <ul v-if="currentWorkspace" class="w-full flex flex-col gap-y-px">
                <li v-for="page in currentWorkspace.pages" :key="page.id" class="w-full">
                    <router-link :to="`/workspaces/${workspaceId}/pages/${page.id}`"
                        class="cursor-default text-sm text-stone-700 hover:text-black hover:bg-stone-200 block rounded-lg px-2 py-1">
                        <div class="flex items-center gap-1 ">
                            <div v-if="page.icon">{{ page.icon }}</div>
                            <DocumentTextIcon class="size-5 shrink-0" v-else></DocumentTextIcon>
                            <div class="truncate">{{ page.title }}</div>
                        </div>
                    </router-link>

                </li>
            </ul>
        </nav>
        <RouterView></RouterView>
    </div>
</template>

<script setup lang="ts">
import { DocumentTextIcon } from "@heroicons/vue/24/outline";
import { useRepo } from '@/composables/useRepo';

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    }
})

const { setCurrentWorkspace, currentWorkspace } = useRepo();
setCurrentWorkspace(props.workspaceId);


</script>

<style scoped>
.router-link-active {
    color: var(--color-black);
    background-color: var(--color-stone-200);
}
</style>