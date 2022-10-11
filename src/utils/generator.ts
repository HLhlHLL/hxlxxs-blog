import { v4 as uuidv4 } from 'uuid'
import {
  IArticle,
  ICategory,
  ITag,
  IArticleMeta,
  IContentArticle,
  IComment
} from '@/types'

interface IArticleInformation {
  article: IArticle
  tags: ITag[]
  category: ICategory
  contentArticle: IContentArticle
}

export const articleGenerator = (
  title: string,
  abstract: string,
  content: string,
  categories: ICategory[],
  tag: string[]
): IArticleInformation => {
  // tags
  const tags: ITag[] = tag.map((t) => ({
    tid: uuidv4(),
    tagName: t
  }))

  // category
  let category = {} as ICategory
  if (categories.length === 1) {
    category = {
      pid: undefined,
      cid: categories[0].cid,
      categoryName: categories[0].categoryName
    }
  } else if (categories.length === 2) {
    category = {
      pid: categories[1].pid,
      cid: categories[1].cid,
      categoryName: categories[1].categoryName
    }
  }

  // meta
  const meta: IArticleMeta = {
    visitedTimes: 0,
    wordCount: content.length,
    costTime: Math.floor(content.length / 400) || 1
  }

  // comment
  const comment = [] as IComment[]

  const article: IArticle = {
    aid: uuidv4(),
    title,
    abstract,
    tid: tags.map((t) => t.tid),
    tags,
    cid: category.cid,
    category,
    meta,
    comment
  }

  const contentArticle: IContentArticle = Object.assign(
    {
      content
    },
    article
  )

  return {
    tags,
    category,
    article,
    contentArticle
  }
}

export const commentGenerator = (
  aid: string,
  content: string,
  pid?: string,
  userName?: string,
  uid?: string
): IComment => {
  const to = {} as IComment

  const comment: IComment = {
    aid,
    uid,
    comid: uuidv4(),
    pid,
    content,
    userName: userName ? userName : 'anonymous',
    subComments: [],
    createdAt: new Date().toISOString(),
    showSubComment: false,
    to
  }

  return comment
}
