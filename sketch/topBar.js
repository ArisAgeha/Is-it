顶部栏Header {
    LOGO .logo,
    首页 .index,
    发现 .discovery,
    话题 .topic,
    搜索 .search,
    通知 .notice {
        关注的用户 {
            .showCard {
                card1: {
                    user: String,
                    string: '新增了',
                    Article || Answser
                }
            }
        },
        关注的问题 {
            .showCard {
                card1: {
                    topic: String,
                    string: '有新的回复'
                }
            }
        }
    }
}
