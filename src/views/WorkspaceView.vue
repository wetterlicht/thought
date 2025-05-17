<template>
  <main>
    <button @click="createPage">Create page</button>
  </main>
</template>

<script setup lang="ts">
import { useRepo } from '@/composables/useRepo';
import router from '@/router';

const props = defineProps({
  workspaceId: {
    type: String,
    required: true
  }
})


const { createPageInWorkspace } = useRepo();
const createPage = () => {
  const pageId = createPageInWorkspace(props.workspaceId);
  router.push(`/workspaces/${props.workspaceId}/pages/${pageId}`);
}

</script>
