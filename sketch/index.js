首页 index {
    动作栏 .action {
        提问 .newQu,
        写文章 .newArticle,
    },
    侧边栏 .asideBar {
        我的收藏 .myCollection,
        我关注的问题 .myFocusQuestion,
        我的邀请 .myInvite
    },
    内容展示 main {
        .topicCard {
            来源信息 .feedSource {
                标签信息 .topicSource,
                用户信息 .userSource
            },
            标题 .cardTitle,
            内容 .cardContent {
                v-if 图片 contentPic,
                文本 contentText
            },
            操作 .controller {
                赞同 .agree
                反对 .disagree
                评论 .comment
                收藏 .collect
                感谢 .thank
            }
        },

        数据：{
            1. let data = getRecommand(i)
            2. data.tpye === 'answer' || 'article'
            data {
                contentID: '142c4mt7u14ctu3401tcf'
                type: 'answer' || 'article',
                source: {
                    topic: 'xxx',
                    user: 'yyy'
                },
                content: {
                    title: 'xxx',
                    ellipsis-content: 'yyy'
                }
            }
        }
    }
}

