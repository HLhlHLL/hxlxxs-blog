export interface ITag {
  tagName: string
  tid: string
  isExist?: boolean
}

export interface ICategory {
  categoryName: string
  cid: string
  pid?: string
  subCategory?: ICategory[]
  isExist?: boolean
}

export interface IArticleMeta {
  costTime: number
  visitedTimes: number
  wordCount: number
}

export interface IComment {
  aid: string
  comid: string
  content: string
  pid?: string
  subComments?: IComment[]
  uid?: string
  userName?: string
  publishTime: string
  timeAgo?: string
  showSubComment?: boolean
  to: IComment
}

export interface IArticle {
  objectId?: string
  abstract: string
  aid: string
  category: ICategory
  cid: string
  comment: IComment[]
  createdAt?: string
  meta: IArticleMeta
  tags: ITag[]
  tid: string[]
  title: string
  updatedAt?: string
}

export interface IContentArticle extends IArticle {
  content: string
}
