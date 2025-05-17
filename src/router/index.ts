import { createRouter, createWebHistory } from 'vue-router'
import CreateWorkspaceView from '@/views/CreateWorkspaceView.vue'
import PageView from '@/views/PageView.vue'
import AppEntryView from '@/views/AppEntryView.vue'
import WorkspaceLayout from '@/views/WorkspaceLayout.vue'
import WorkspaceView from '@/views/WorkspaceView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: AppEntryView
    },
    {
      path: '/workspaces/create',
      component: CreateWorkspaceView
    },
    {
      path: '/workspaces/:workspaceId',
      component: WorkspaceLayout,
      props: true,
      children: [
        {
          path: '',
          component: WorkspaceView,
          props: true
        },
        {
          path: 'pages/:pageId',
          component: PageView,
          props: true
        },
      ]
    },

  ],
})

export default router
