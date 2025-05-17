<template>
  <main class="p-4 flex-grow mx-4">
    <Editor v-if="currentPage" :key="pageId"></Editor>
  </main>
</template>

<script setup lang="ts">
import Editor from "@/components/Editor.vue";
import { useRepo } from "../composables/useRepo.ts"
import { onMounted, watch } from "vue";
const { setCurrentPage, currentPage } = useRepo();

const props = defineProps({
  pageId: {
    type: String,
    required: true
  }
})

onMounted(async () => {
  await setCurrentPage(props.pageId);
})

watch(() => props.pageId, async (value: string) => {
  await setCurrentPage(value);
});

</script>
