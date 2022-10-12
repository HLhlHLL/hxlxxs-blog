<script setup lang="ts">
import { ref, inject, watch } from 'vue'
import MdEditor, { ToolbarNames } from 'md-editor-v3'
import { commentGenerator } from '@/utils/generator'
import { IArticle, IComment } from '@/types'
import { useRoute } from 'vue-router'
import { timeAgoFn } from '@/utils/shared'

type PropsData = {
  comment: IComment[]
  article?: IArticle
  page?: string
}
const props = defineProps<PropsData>()
const route = useRoute()
const global: any = inject('global')

const toolbars = ref<ToolbarNames[]>(['=', 'preview'])
const content = ref<string>('')
const comid = ref<string>('')
const replyContent = ref<string>('')
const subReplyContent = ref<string>('')

// 保存被回复的评论
let currentSub: IComment
// 发表评论
const handleComment = async (com?: IComment, sub?: IComment) => {
  const aid = (route.params.aid as string) || ''
  let comment: IComment
  if (!com && !sub) {
    // 主评论
    comment = commentGenerator(aid, content.value)
    updateComment(comment)
    comid.value = comment.comid
    content.value = ''
    props.comment.unshift(comment)
  } else if (com && !sub) {
    // 子评论
    comment = commentGenerator(aid, replyContent.value, com!.comid)
    updateComment(comment)
    comid.value = comment.comid
    replyContent.value = ''
    com!.subComments!.unshift(comment)
    com.showSubComment = false
    flag1 = ''
  } else if (com && sub) {
    // 回复子评论
    comment = commentGenerator(aid, subReplyContent.value, com!.comid)
    updateComment(comment)
    comid.value = comment.comid
    comment.to = currentSub
    subReplyContent.value = ''
    com!.subComments!.push(comment)
    sub.showSubComment = false
    flag2 = ''
  }
}
const updateComment = async (comment: IComment) => {
  // 文章评论
  try {
    if (props.article) {
      await global.$http.put(
        `/api/1.1/classes/contentArticle/${props.article.objectId}`,
        {
          comment: { __op: 'Add', objects: [comment] }
        }
      )
      await global.$http.put(
        `/api/1.1/classes/articles/${route.params.objectId}`,
        {
          comment: { __op: 'Add', objects: [comment] }
        }
      )
    } else if (!props.article && props.page) {
      // 关于页评论
      if (props.page === 'about') {
        await global.$http.put(
          `/api/1.1/classes/comments/6344220d318a6c5d6f03e232`,
          {
            aboutComment: { __op: 'Add', objects: [comment] }
          }
        )
      }
      // 评论页
      if (props.page === 'comment') {
        await global.$http.put(
          `/api/1.1/classes/comments/6344220d318a6c5d6f03e232`,
          {
            comment: { __op: 'Add', objects: [comment] }
          }
        )
      }
    }
    global.$message({
      message: '评论成功咯！！',
      type: 'success'
    })
  } catch (error) {
    global.$message({
      message: '出了点错误，评论失败！！',
      type: 'danger'
    })
  }
}

// 控制评论输入框开关
let flag1 = ''
const handleReply = (item: IComment) => {
  props.comment.forEach((c) => {
    c.showSubComment = false
  })
  if (flag1 !== item.comid) {
    item.showSubComment = !item.showSubComment
    flag1 = item.comid
  } else {
    flag1 = ''
  }
}
let flag2 = ''
const handleSubReply = (item: IComment, index: number) => {
  currentSub = item
  ;(props.comment[index].subComments as IComment[]).forEach((c) => {
    c.showSubComment = false
  })
  if (flag2 !== item.comid) {
    item.showSubComment = !item.showSubComment
    flag2 = item.comid
  } else {
    flag2 = ''
  }
}

// 格式化发布时间
const formatTimeAgo = (comments: IComment[]) => {
  comments.forEach((c) => {
    const createdTime = new Date(c.createdAt as string).getTime()
    c.timeAgo = timeAgoFn(new Date().getTime() - createdTime)
    if (c.subComments) {
      formatTimeAgo(c.subComments)
    }
  })
}

watch(
  () => props.comment,
  () => {
    formatTimeAgo(props.comment)
  },
  {
    deep: true
  }
)
</script>

<template>
  <div class="comments animate__animated animate__fadeIn">
    <div class="editor">
      <MdEditor
        v-model="content"
        style="height: 200px"
        placeholder="欢迎在评论区留言"
        :toolbars="toolbars"
      />
      <div class="submit">
        <button class="submit-button" @click="handleComment()">发表评论</button>
      </div>
    </div>
    <template v-if="props.comment.length > 0">
      <div
        class="comment-item"
        v-for="(item, index) in props.comment"
        :key="item.comid"
      >
        <div class="avatar">
          <img
            src="https://gravatar.loli.net/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mp&v=1.5.1"
          />
        </div>
        <div class="comment-main">
          <div class="user-box">
            <div class="username">
              {{ item.userName || 'anonymous' }}
            </div>
            <div class="c-meta">{{ item.timeAgo + '' }}</div>
          </div>
          <div class="c-content">
            {{ item.content }}
          </div>
          <div class="action-box">
            <span class="reply" @click="handleReply(item)">
              <span>
                <i class="iconfont icon-liuyan"></i>
                <span>{{ item.subComments?.length }}</span>
              </span>
              <span class="reply-text">回复</span>
            </span>
          </div>
          <div class="subEditor" v-if="item.showSubComment">
            <MdEditor
              v-model="replyContent"
              style="height: 150px"
              placeholder="回复"
              :toolbars="['=', 'preview']"
            />
            <div class="submit">
              <button class="submit-button" @click="handleComment(item)">
                回复
              </button>
            </div>
          </div>
          <template v-if="(item.subComments as Array<any>).length > 0">
            <div
              class="sub-comments"
              v-for="sub in item.subComments"
              :key="sub.comid"
            >
              <div class="sub-item">
                <div class="sub-avatar">
                  <img
                    src="https://gravatar.loli.net/avatar/d41d8cd98f00b204e9800998ecf8427e?d=mp&v=1.5.1"
                  />
                </div>
                <div class="sub-main">
                  <div class="sub-user-box">
                    <div class="sub-user">
                      <div class="sub-username">anonymous</div>
                      <span class="reply-to" v-if="sub.to?.userName">
                        {{ '回复 ' + sub.to.userName }}
                      </span>
                    </div>
                    <div class="sub-meta" :attr="new Date()">
                      {{ sub.timeAgo }}
                    </div>
                  </div>
                  <div class="sub-content">{{ sub.content }}</div>
                  <div class="sub-action-box">
                    <span class="liuyan" @click="handleSubReply(sub, index)">
                      <i class="iconfont icon-liuyan"></i>
                      <span class="liuyan-count">回复</span>
                    </span>
                  </div>
                  <div class="subEditor" v-if="sub.showSubComment">
                    <MdEditor
                      v-model="subReplyContent"
                      style="height: 150px; width: 750px"
                      placeholder="回复"
                      :toolbars="['=', 'preview']"
                    />
                    <div class="submit">
                      <button
                        class="submit-button"
                        @click="handleComment(item, sub)"
                      >
                        回复
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <div class="blank" v-if="props.comment.length === 0">
      <span>暂时没有更多评论</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comments {
  margin-top: 60px;
  .editor {
    margin-top: 40px;
    border-bottom: 1px solid #eee;
    text-align: right;
    .submit-button {
      margin: 20px 0;
      width: 80px;
      height: 35px;
      border: none;
      font-size: 14px;
      font-weight: 600;
      color: #222;
      cursor: pointer;
      transition: all 0.2s linear;
      &:hover {
        background-color: #222;
        color: #fff;
      }
    }
    .submit-button:active {
      background-color: #222;
      color: #fff;
    }
  }
  .comment-item {
    display: flex;
    margin: 40px 0;
    .avatar {
      width: 50px;
      height: 50px;
      background-color: #999;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .comment-main {
      margin-left: 20px;
      flex: 1;
      .user-box {
        display: flex;
        justify-content: space-between;
        .username {
          font-size: 15px;
        }
        .c-meta {
          font-size: 12px;
          color: #999;
        }
      }
      .c-content {
        margin-top: 15px;
        line-height: 1.5;
        font-size: 14px;
      }
      .action-box {
        margin-top: 15px;
        color: #999;
        font-size: 14px;
        .reply {
          margin-right: 10px;
          text-align: center;
          cursor: pointer;
          &:hover {
            color: #555;
          }
          .iconfont {
            margin-right: 3px;
          }
          .reply-text {
            margin-left: 3px;
          }
        }
      }

      .subEditor {
        margin-top: 10px;
        display: flex;
        justify-content: space-around;
        align-items: end;
        .submit-button {
          margin-left: 20px;
          width: 80px;
          height: 35px;
          border: none;
          font-size: 14px;
          font-weight: 600;
          color: #222;
          cursor: pointer;
          transition: all 0.2s linear;
          &:hover {
            background-color: #222;
            color: #fff;
          }
        }
        .submit-button:active {
          background-color: #222;
          color: #fff;
        }
      }
      .sub-comments {
        margin-top: 15px;
        padding: 15px;
        background-color: #f9fafb;
        .sub-item {
          display: flex;
          .sub-avatar {
            width: 40px;
            height: 40px;
            background-color: #999;
            border-radius: 50%;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          .sub-main {
            margin-left: 15px;
            flex: 1;
            .sub-user-box {
              display: flex;
              justify-content: space-between;
              .sub-username {
                color: #555;
                font-size: 15px;
              }
              .reply-to {
                font-size: 12px;
                color: #999;
              }
              .sub-meta {
                color: #999;
                font-size: 12px;
              }
            }
            .sub-content {
              margin-top: 15px;
              font-size: 14px;
              line-height: 1.5;
            }
            .sub-action-box {
              margin-top: 15px;
              color: #999;
              font-size: 14px;
              .liuyan {
                margin-right: 10px;
                cursor: pointer;
              }
              .liuyan:hover {
                color: #555;
              }
              .iconfont {
                margin-right: 3px;
              }
            }
          }
        }
      }
    }
  }
  .blank {
    margin-top: 40px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    color: #999;
    background-color: #fafafa;
  }
}
</style>
