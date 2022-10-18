import { ICategory, IComment } from '@/types'

export const timeAgoFn = (timestamp: number) => {
  if (timestamp < 0)
    throw new Error('timestamp should not be an negative number!')
  if ((timestamp = Math.floor(timestamp / 1000)) >= 60) {
    if ((timestamp = Math.floor(timestamp / 60)) >= 60) {
      if ((timestamp = Math.floor(timestamp / 60)) >= 24) {
        if ((timestamp = Math.floor(timestamp / 24)) >= 30) {
          if ((timestamp = Math.floor(timestamp / 30)) >= 12) {
            return Math.floor(timestamp / 12) + ' 年前'
          } else {
            return timestamp + ' 月前'
          }
        } else {
          return timestamp + ' 天前'
        }
      } else {
        return timestamp + ' 小时前'
      }
    } else {
      return timestamp + ' 分前'
    }
  } else {
    return '刚刚'
  }
}

export const formatCommentTree = (comment: IComment[]) => {
  if (!comment || comment.length <= 0) {
    return []
  }
  const res = comment.filter((c) => !c.pid)
  // 主评论按时间升序排列，子评论不变
  res.sort((pre: IComment, next: IComment) => {
    return (
      new Date(next.createdAt).getTime() - new Date(pre.createdAt).getTime()
    )
  })
  // 将子评论插入对应主评论
  res.forEach((r) => {
    comment.forEach((c) => {
      if (r.comid === c.pid) {
        r.subComments?.push(c)
      }
    })
  })
  return res
}

export const formatCategoryTree = (category: ICategory[]) => {
  if (category.length <= 0) {
    return []
  }

  const parent = category.filter((c) => !c.pid)
  const children = category.filter((c) => c.pid)

  function dataToTree(parent: ICategory[], children: ICategory[]) {
    parent.forEach((p) => {
      children.forEach((c) => {
        if (p.cid === c.pid) {
          const _children = children.filter((_c) => c.pid !== _c.pid)
          dataToTree([c], _children)
          if (p.subCategory) {
            p.subCategory.push(c)
          } else {
            p.subCategory = [c]
          }
        }
      })
    })
  }

  dataToTree(parent, children)
  return parent
}

export const mergeCategories = (
  baseCategory: ICategory[],
  newCategory: ICategory[]
) => {
  const res = newCategory.filter((nc) => {
    return baseCategory.every((bc) => bc.cid !== nc.cid)
  })
  return [...baseCategory, ...res]
}
