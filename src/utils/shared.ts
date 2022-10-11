import { IComment } from '@/types'

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

export const formatCommentTree = (com: IComment[]) => {
  // 格式化发布时间
  com.forEach((c) => {
    const createdTime = new Date(c.createdAt as string).getTime()
    c.timeAgo = timeAgoFn(new Date().getTime() - createdTime)
  })
  const res = com.filter((c) => !c.pid)
  // 主评论按时间升序排列，子评论不变
  res.sort((pre: IComment, next: IComment) => {
    return (
      new Date(next.createdAt).getTime() - new Date(pre.createdAt).getTime()
    )
  })
  // 将子评论插入对应主评论
  res.forEach((r) => {
    com.forEach((c) => {
      if (r.comid === c.pid) {
        r.subComments?.push(c)
      }
    })
  })
  return res
}
