<template>
    <div>

    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import { useRepo } from '@/composables/useRepo'

const router = useRouter()
const { currentWorkspace, setCurrentWorkspace, getDefaultWorkspaceId } = useRepo()

const workspaceId = getDefaultWorkspaceId();
if (workspaceId) {
    setCurrentWorkspace(workspaceId);
}

onMounted(() => {
    const workspace = currentWorkspace.value
    if (workspace) {
        const pageId = workspace.pages.length > 0 ? workspace.pages[0].id : null
        if (pageId) {
            router.replace(`/workspaces/${workspace.id}/pages/${pageId}`)
        } else {
            router.replace(`/workspaces/${workspace.id}`)
        }
    } else {
        router.replace('/workspaces/create')
    }
})
</script>

<style scoped></style>