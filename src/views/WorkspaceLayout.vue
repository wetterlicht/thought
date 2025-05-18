<template>
    <div class="flex h-screen" v-if="currentWorkspace">
        <nav class="w-92 bg-stone-100 border-r border-stone-200 p-4">
            <div class="text-sm text-stone-600 mb-px">Workspace</div>
            <div class="mb-4">{{ currentWorkspace.name }}</div>
            <div class="text-sm text-stone-600 mb-2">Pages</div>
            <button @click="addNewPage"
                class="w-full text-stone-600 flex items-center gap-1 mb-2 hover:text-black hover:bg-stone-200 rounded-lg px-2 py-1">
                <DocumentPlusIcon class=" size-5"></DocumentPlusIcon>
                <div>Add New Page</div>
            </button>
            <PageList v-if="currentWorkspace" :workspaceId="currentWorkspace.id" :pages="currentWorkspace.pages"
                class="w-full flex flex-col gap-y-px">
            </PageList>
        </nav>
        <RouterView></RouterView>
    </div>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import { DocumentPlusIcon } from "@heroicons/vue/24/outline";
import router from "@/router";
import PageList from "@/components/PageList.vue";

const props = defineProps({
    workspaceId: {
        type: String,
        required: true
    }
})

const { setCurrentWorkspace, currentWorkspace, createPageInWorkspace } = useRepo();
setCurrentWorkspace(props.workspaceId);

const addNewPage = () => {
    if (currentWorkspace.value) {
        const newPageId = createPageInWorkspace(currentWorkspace.value.id);
        router.push(`/workspaces/${props.workspaceId}/pages/${newPageId}`);
    }
}

</script>

<style scoped></style>