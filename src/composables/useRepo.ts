import {
    DocHandle,
    isValidAutomergeUrl,
    Repo,
    type AutomergeUrl,
} from "@automerge/automerge-repo"
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { computed, markRaw, ref, type ComputedRef, type Ref, watchEffect } from "vue";
import TextBlock from "@/components/TextBlock.vue";
import HeadingBlock from "@/components/HeadingBlock.vue";
import ImageBlock from "@/components/ImageBlock.vue";
import type { AssembledPage, AssetDocument, Block, BlockList, BlockWithComponent, PageDocument, PageDocumentWithParent, RootDocument, WorkspaceWithPages } from "@/types";

const repo = new Repo({
    network: [
        // new BrowserWebSocketClientAdapter("ws://localhost:3030"),
    ],
    storage: new IndexedDBStorageAdapter(),
});

let rootDocumentHandle: DocHandle<RootDocument> | null = null;
const rootDocument: Ref<RootDocument | undefined> = ref();
const currentWorkspaceId: Ref<string | undefined> = ref();
const currentPageId: Ref<AutomergeUrl | undefined> = ref();
const pageHandles: Map<AutomergeUrl, DocHandle<PageDocument>> = new Map<AutomergeUrl, DocHandle<PageDocument>>();
const pages: Ref<Map<AutomergeUrl, PageDocumentWithParent>> = ref(new Map<AutomergeUrl, PageDocumentWithParent>());

const getRootDocumentURL = () => {
    return localStorage.getItem("RootDocumentURL");
}

const setRootDocumentURL = (url: AutomergeUrl) => {
    return localStorage.setItem("RootDocumentURL", url);
}

const initRootDocument = async () => {
    const rootDocURL = getRootDocumentURL();
    let handle = null;
    if (isValidAutomergeUrl(rootDocURL)) {
        handle = await repo.find<RootDocument>(rootDocURL)
    } else {
        handle = await repo.create<RootDocument>({
            workspaces: []
        })
        setRootDocumentURL(handle.url);
    }
    rootDocumentHandle = handle;
    rootDocument.value = handle.doc();
    handle.on("change", (newDoc) => {
        rootDocument.value = newDoc.doc;
    });
}
await initRootDocument();

const createWorkspace = (name: string): string => {
    if (!rootDocumentHandle) {
        throw new Error("rootDocumentHandle not set in createWorkspace");
    }
    const workspace = {
        id: crypto.randomUUID(),
        name,
        assetIds: [],
        pageIds: []
    };

    rootDocumentHandle.change(doc => {
        doc.workspaces.push(workspace)
    })
    return workspace.id;
}

const getDefaultWorkspaceId = (): string | null => {
    if (!rootDocument.value) {
        throw new Error("rootDocument not set in getDefaultWorkspaceId");
    }
    const workspaces = rootDocument.value.workspaces;
    if (workspaces.length > 0) {
        return workspaces[0].id;
    }
    return null;
}

const setCurrentWorkspace = (id: string) => {
    currentWorkspaceId.value = id
}

watchEffect(async () => {
    const currentWorkspace = rootDocument.value?.workspaces.find(workspace => workspace.id === currentWorkspaceId.value);
    if (currentWorkspace) {
        await loadPages(currentWorkspace.pageIds, currentWorkspace.id, null);
    }
})

const loadPages = async (ids: AutomergeUrl[], parentWorkspaceId: string | null, parentPageId: AutomergeUrl | null) => {
    for (const id of ids) {
        if (pages.value.has(id)) {
            continue;
        }
        const pageHandle = await repo.find<PageDocument>(id);
        pageHandles.set(id, pageHandle);
        pages.value.set(id, ({
            ...pageHandle.doc(),
            parentWorkspaceId,
            parentPageId,
        }));
        pageHandle.on('change', (newDoc) => {
            pages.value.set(id, ({
                ...newDoc.doc,
                parentWorkspaceId,
                parentPageId,
            }));
            loadPages(pageHandle.doc().childIds, null, id);
        })
        loadPages(pageHandle.doc().childIds, null, id);
    }
}

const currentWorkspace: ComputedRef<WorkspaceWithPages | null> = computed(() => {
    const workspace = rootDocument.value?.workspaces.find(workspace => workspace.id === currentWorkspaceId.value);
    if (!workspace) {
        return null;
    }
    return {
        ...workspace,
        pages: workspace!.pageIds.map(id => getPageById(id)).filter((page): page is AssembledPage => page !== null),
    }
})

const getPageById = (id: AutomergeUrl): AssembledPage | null => {
    const page = pages.value.get(id);
    if (!page) {
        return null;
    }
    const children = page.childIds.map(childId =>
        getPageById(childId)).filter((child): child is AssembledPage => child !== null);
    return {
        ...page,
        id,
        children,
    }
}

const createPageInWorkspace = (workspaceId: string): AutomergeUrl => {
    if (!rootDocumentHandle) {
        throw new Error("rootDocumentHandle not set in createPageInWorkspace");
    }
    const pageHandle = createEmptyPage();
    rootDocumentHandle.change(doc => {
        const workspaceIndex = doc.workspaces.findIndex(workspace => workspace.id === workspaceId);
        doc.workspaces[workspaceIndex].pageIds.push(pageHandle.url)
    })
    return pageHandle.url;
}

const createPageInPage = (pageId: AutomergeUrl): AutomergeUrl => {
    const parentPageHandle = pageHandles.get(pageId);
    if (!parentPageHandle) {
        throw new Error("parentPageHandle not set in createPageInPage");
    }
    const pageHandle = createEmptyPage();
    parentPageHandle.change(doc => {
        doc.childIds.push(pageHandle.url)
    })
    return pageHandle.url;
}

const createEmptyPage = (): DocHandle<PageDocument> => {
    const block = createBlock("Text");
    const blocks: Record<string, Block> = {};
    blocks[block.id] = block;
    const blockListId = crypto.randomUUID();
    const blockList = {
        id: blockListId,
        blockIds: [block.id]
    }
    const blockLists: Record<string, BlockList> = {};
    blockLists[blockListId] = blockList;
    const pageHandle = repo.create<PageDocument>({
        title: 'New Page',
        blockListId,
        childIds: [],
        blockLists,
        blocks,

    })
    return pageHandle;
}

const deletePage = (pageId: AutomergeUrl) => {
    const page = getPageById(pageId);
    if (!page) {
        throw new Error(`Page with id ${pageId} not found in deletePage`);
    }
    for (const childId of page.childIds) {
        deletePage(childId);
    }
    if (page.parentPageId) {
        const parentPageHandle = pageHandles.get(page.parentPageId);
        if (!parentPageHandle) {
            throw new Error("parentPageHandle not set in deletePage");
        }
        parentPageHandle.change(doc => {
            const pageIndex = doc.childIds.findIndex(childId => childId === pageId);
            doc.childIds.splice(pageIndex, 1);
        })
        repo.delete(pageId);
    }
    else if (page.parentWorkspaceId) {
        if (!rootDocumentHandle) {
            throw new Error("rootDocumentHandle not set in deletePage");
        }
        rootDocumentHandle.change(doc => {
            const workspaceIndex = doc.workspaces.findIndex(workspace => workspace.id === page.parentWorkspaceId);
            if (workspaceIndex !== -1) {
                const pageIndex = doc.workspaces[workspaceIndex].pageIds.findIndex(id => id === pageId);
                doc.workspaces[workspaceIndex].pageIds.splice(pageIndex, 1);
            }
        });
        repo.delete(pageId);
    }
}

const setCurrentPage = (id: string) => {
    if (!isValidAutomergeUrl(id)) {
        throw new Error(`Invalid argument for setCurrentPage: ${id}`)

    }
    currentPageId.value = id;
}

const currentPage = computed(() => {
    if (!currentPageId.value) {
        return null;
    }
    return pages.value.get(currentPageId.value);
})


const getComponent = (type: string) => {
    let component = null;
    switch (type) {
        case 'Text':
            component = TextBlock;
            break;
        case 'Heading 1':
            component = HeadingBlock;
            break;
        case 'Heading 2':
            component = HeadingBlock;
            break;
        case 'Heading 3':
            component = HeadingBlock;
            break;
        case 'Image':
            component = ImageBlock;
            break;
        default:
            throw new Error("Unknown block name: " + name);
    }

    return markRaw(component);
}

const createAsset = (data: string) => {
    if (!rootDocumentHandle) {
        throw new Error("rootDocumentHandle not set in createAsset");
    }
    if (!currentWorkspaceId.value) {
        throw new Error("currentWorkspaceId not set in createAsset");
    }

    const assetHandle = repo.create<AssetDocument>({
        type: 'image',
        data
    })

    rootDocumentHandle.change(doc => {
        const workspaceIndex = doc.workspaces.findIndex(workspace => workspace.id === currentWorkspaceId.value);
        doc.workspaces[workspaceIndex].assetIds.push(assetHandle.url)
    })

    return assetHandle.url;
}

const getCurrentPageHandle = () => {
    if (!currentPageId.value) {
        throw new Error("currentPageId not set in getCurrentPageHandle");
    }
    const pageHandle = pageHandles.get(currentPageId.value);
    if (!pageHandle) {
        throw new Error("pageHandle not set in getCurrentPageHandle");
    }
    return pageHandle;
}

const blocksByListId = computed(() => (blockListId: string): BlockWithComponent[] => {
    const blockList = currentPage.value!.blockLists[blockListId];
    return blockList.blockIds.map((blockId) => {
        const block = currentPage.value!.blocks[blockId];
        return {
            ...block,
            component: getComponent(block.type),
        };
    });
});

const blockById = computed(() => (blockId: string): BlockWithComponent => {
    const block = currentPage.value!.blocks[blockId];
    return {
        ...block,
        component: getComponent(block.type),
    };

});

const updateBlockData = (id: string, data: Record<string, unknown>) => {
    getCurrentPageHandle().change((doc => {
        const block = doc.blocks[id];
        if (!block) {
            throw new Error(`Block with id ${id} not found.`);
        }
        block.data = data;
    }))
}

const insertBlockAtIndex = (blockListId: string, type: string, index: number): string => {
    const block = createBlock(type);
    getCurrentPageHandle().change((doc => {
        doc.blocks[block.id] = block;
        const blockList: BlockList = doc.blockLists[blockListId];
        blockList.blockIds.splice(index, 0, block.id);
    }));
    return block.id
}

const deleteBlockAtIndex = (blockListId: string, index: number) => {
    getCurrentPageHandle().change((doc) => {
        const blockList: BlockList = doc.blockLists[blockListId];
        const blockId = blockList.blockIds.splice(index, 1)[0];
        delete doc.blocks[blockId];
    })
}

const replaceBlockAtIndex = (blockListId: string, type: string, index: number) => {
    getCurrentPageHandle().change((doc => {
        const blockList: BlockList = doc.blockLists[blockListId];
        const id = blockList.blockIds[index];
        const block = createBlock(type, id);
        doc.blocks[id] = block;
    }));
}

const createBlock = (type: string, existingId?: string): Block => {

    let data;

    switch (type) {
        case 'Text':
            data = {
                content: []
            }
            break;
        case 'Heading 1':
            data = {
                content: [],
                level: 1
            }
            break;
        case 'Heading 2':
            data = {
                content: [],
                level: 2
            }
            break;
        case 'Heading 3':
            data = {
                content: [],
                level: 3
            }
            break;
        case 'Image':
            data = {
                src: null,
                alt: null,
                caption: null
            }
            break;
        default:
            throw new Error("Unknown block name: " + name);
    }

    return {
        id: existingId ? existingId : crypto.randomUUID(),
        type,
        data
    }
}

const setCoverImage = (id: AutomergeUrl) => {
    getCurrentPageHandle().change((doc) => {
        doc.coverImageId = id;
    })
}

const setPageTitle = (title: string) => {
    getCurrentPageHandle().change((doc) => {
        doc.title = title;
    })
}

const setPageIcon = (icon: string) => {
    getCurrentPageHandle().change((doc) => {
        doc.icon = icon;
    })
}

export function useRepo() {
    return {
        createWorkspace,
        currentWorkspace,
        getDefaultWorkspaceId,
        setCurrentWorkspace,
        currentPage,
        currentPageId,
        setCurrentPage,
        createPageInWorkspace,
        createPageInPage,
        deletePage,
        blocksByListId,
        blockById,
        updateBlockData,
        insertBlockAtIndex,
        deleteBlockAtIndex,
        replaceBlockAtIndex,
        createAsset,
        setCoverImage,
        setPageTitle,
        setPageIcon,
    }
}