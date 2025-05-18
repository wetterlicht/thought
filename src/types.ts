import type { AutomergeUrl } from "@automerge/automerge-repo"
import type { Component } from "vue"

export interface RootDocument {
    workspaces: Workspace[],
}

export interface AssetDocument {
    type: 'image'
    data: string
}

export interface Workspace {
    id: string,
    name: string,
    pageIds: AutomergeUrl[],
    assetIds: AutomergeUrl[]
}

export interface WorkspaceWithPages extends Omit<Workspace, 'pageIds'> {
    pages: PageDocumentWithId[],
}

export interface PageDocument {
    title: string,
    blockListId: string,
    coverImageId?: AutomergeUrl,
    blockLists: Record<string, BlockList>
    blocks: Record<string, Block>
    icon?: string,
    childIds: AutomergeUrl[]
}

export interface PageDocumentWithId extends PageDocument {
    id: AutomergeUrl,
    children: PageDocumentWithId[]
}

export interface BlockList {
    id: string,
    blockIds: string[]
}

export interface Block {
    id: string,
    type: string,
    data: Record<string, unknown>
}

export interface BlockWithComponent extends Block {
    component: Component
}

export interface Segment {
    type: "text",
    text: string,
    format: string[],
}

export interface FocusableBlock {
    focusBlock(focusStart: boolean): void
}