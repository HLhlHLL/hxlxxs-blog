<script setup lang="ts">
import { ref, inject, watch, onBeforeMount } from 'vue'
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
const captcha = ref({
  captcha_token: '',
  captcha_url: ''
})
const username = ref<string>()
const code = ref<string>()

// 保存被回复的评论
let currentSub: IComment
// 发表评论
const handleComment = async (com?: IComment, sub?: IComment) => {
  if(!username.value || !code.value) {
    return global.$message({
      message: '请先输入昵称和验证码哦！！',
      type: 'warning'
    })
  }

  const aid = (route.params.aid as string) || ''
  let comment: IComment
  if (!com && !sub) {
    if(!content.value) {
      return global.$message({
        message: '评论内容不能为空哦！！',
        type: 'warning'
      })
    }
    const validator = await verifyCaptcha()
    if(!validator) return 
    
    // 主评论
    comment = commentGenerator(aid, content.value, '', username.value)
    updateComment(comment)
    comid.value = comment.comid
    content.value = ''
    props.comment.unshift(comment)
  } else if (com && !sub) {
    if(!replyContent.value) {
      return global.$message({
        message: '回复内容不能为空哦！！',
        type: 'warning'
      })
    }
    const validator = await verifyCaptcha()
    if(!validator) return 

    // 子评论
    comment = commentGenerator(aid, replyContent.value, com!.comid, username.value)
    updateComment(comment)
    comid.value = comment.comid
    replyContent.value = ''
    com!.subComments!.unshift(comment)
    com.showSubComment = false
    flag1 = ''
  } else if (com && sub) {
    if(!subReplyContent.value) {
      return global.$message({
        message: '回复内容不能为空哦！！',
        type: 'warning'
      })
    }
    const validator = await verifyCaptcha()
    if(!validator) return 

    // 回复子评论
    comment = commentGenerator(aid, subReplyContent.value, com!.comid, username.value)
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
        await global.$http.post('/api/1.1/classes/about_comment', {
          ...comment
        })
      }
      // 评论页
      if (props.page === 'comment') {
        await global.$http.post('/api/1.1/classes/comment', {
          ...comment
        })
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

const verifyCaptcha = async () => {
  try {
    const {data} = await global.$http.post('/api/1.1/verifyCaptcha', {
      captcha_code: code.value,
      captcha_token: captcha.value.captcha_token
    })
    return !!data.validate_token
  } catch (error) {
    global.$message({
      message: '验证码错误！！',
      type: 'danger'
    })
    return false
  } finally {
    code.value = ''
    getCodeUrl()
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

const handleChangeCode = () => {
  getCodeUrl()
}

const handleShowMoreComments = (e: Event) => {
   const showMoreBtnEl = e.currentTarget as HTMLElement
   const showMoreEl = showMoreBtnEl.parentElement
   const CommentEl = showMoreEl!.parentElement
   showMoreEl!.style.display = 'none'
   CommentEl!.classList.add('show-more-none')
   CommentEl!.style.overflow = 'visible'
}

// 格式化发布时间
const formatTimeAgo = (comments: IComment[]) => {
  comments.forEach((c) => {
    const createdTime = new Date(c.publishTime as string).getTime()
    c.timeAgo = timeAgoFn(new Date().getTime() - createdTime)
    if (c.subComments) {
      formatTimeAgo(c.subComments)
    }
  })
}

const getCodeUrl = async () => {
  const {data} = await global.$http.get('/api/1.1/requestCaptcha?width=80&height=40')
  captcha.value = data
}

onBeforeMount(() => {
  getCodeUrl()
})

watch(
  () => props.comment,
  (newValue) => {
    formatTimeAgo(newValue)
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
    </div>
    <div class="validate">
      <div class="user">
        <input class="username-ipt" type="text" placeholder="nickname" maxlength="16" v-model="username">
      </div>
      <div class="code">
        <input class="code-ipt" type="text" placeholder="验证码" maxlength="4" v-model="code">
      </div>
      <div class="captcha" @click="handleChangeCode">
        <img :src="captcha.captcha_url" title="看不清？换一张">
      </div>
    </div>
    <span class="hint">(请先输入昵称和验证码才能评论哦！！)</span>
    <button class="submit-button" @click="handleComment()">发表评论</button>
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
      <div
        class="comment-main"
        :class="[]"
        :style="{
          maxHeight: ((item.subComments as IComment[]).length) > 5 ? '600px' : 'none'
        }"
      >
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
        <transition name="sub">
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
        </transition>
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
                  <div class="sub-username">{{sub.userName}}</div>
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
              <transition name="sub">
                <div class="subEditor" v-if="sub.showSubComment">
                <MdEditor
                  v-model="subReplyContent"
                  style="height: 150px;"
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
              </transition>
            </div>
          </div>
        </div>
        <div class="show-more" v-if="(item.subComments as Array<IComment>).length > 5">
          <span class="show-more-button" @click="handleShowMoreComments">
            <span class="show-more-text">查看更多评论</span>
            <i class="iconfont icon-down"></i>
          </span>
        </div>
      </div>
    </div>
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
  }
  .validate {
    position: sticky;
    top: 10px;
    display: inline-flex;
    align-items: center;
    margin: 18px 10px 18px 0;
    z-index: 2;
    .user {
      .username-ipt {
        width: 160px;
        padding: 10px;
        outline: none;
        font-size: 16px;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        &::placeholder {
          color: #bbb;
        }
      }
    }
    .code {
      margin-left: 10px;
      .code-ipt {
        width: 80px;
        padding: 10px;
        outline: none;
        font-size: 16px;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        &::placeholder {
          color: #bbb;
        }
      }
    }
    .captcha {
      width: 80px;
      height: 40px;
      background-color: #f6f6f6;
      margin-left: 10px;
      border-radius: 5px;
      overflow: hidden;
      cursor: pointer;
      img {
        width: 100%;
        height: 100%;
        font-size: 0;
        object-fit: cover;
      }
    }
  }
  .hint {
    margin-right: 20px;
    font-size: 14px;
    color: #d6d6d6;
  }
  .submit-button {
    margin: 20px 0;
    width: 80px;
    height: 35px;
    border: none;
    font-size: 14px;
    font-weight: 600;
    color: #222;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.2s linear;
    &:hover {
      background-color: #222;
      color: #fff;
    }
    &:active {
      background-color: #222;
      color: #fff;
    }
  }
  .comment-item {
    display: flex;
    padding: 20px;
    border-top: 1px solid #eee;
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
      position: relative;
      margin-left: 20px;
      overflow: hidden;
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
        }
      }
      .sub-comments {
        margin-top: 15px;
        padding: 15px;
        background-color: #fdfdfd;
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

      .show-more {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 40px;
        color: #222;
        text-align: center;
        background-image: linear-gradient(to top, #666 ,#fff);
        filter: opacity(0.5);
        .show-more-button {
          display: inline-flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          height: 100%;
          cursor: pointer;
          &:hover {
            color: #000;
          }
        }
      }
    }
    .show-more-none {
      max-height: none !important;
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

.sub-enter-active,
.sub-leave-active {
  transition: opacity 0.3s ease;
}

.sub-enter-from,
.sub-leave-to {
  opacity: 0;
}
</style>
