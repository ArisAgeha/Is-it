<template>
    <div class="mask" v-if="showQuestionEditor" @click="toggleQuestionEditor">
        <div class="aq-wrapper" @click.stop>
            <h3 class="aq-navTitle">写下你的问题</h3>
            <div class="aq-navDescription">描述精确的问题更易得到解答</div>
            <div class="aq-content">
                <textarea placeholder="问题标题" class="aq-title" type="text" v-model="titleInput"></textarea>
                <div class="titleWordLimit" v-if="showTitleWordLimit">标题超过字数限制（50字）</div>
                <input placeholder="添加话题（最多5个，用空格分开）" class="aq-topic" type="text" v-model="topicInput"></input>
                <div class="topicWordLimit" v-if="showTopicWordLimit">话题数量超过限制（5个）</div>
                <div class="aq-content-hint">问题描述（可选）：</div>
                <textarea placeholder="问题背景、条件等详细信息（可选）" class="aq-description" type="text" v-model="descriptionInput"></textarea>
                <button class="questionSubmit" @click="questionSubmit">提交</button>
            </div>
        </div>
    </div>
</template>

<script>
import req from '../models/req.js';
export default {
    data() {
        return {
            titleInput: '',
            topicInput: '',
            descriptionInput: ''
        }
    },
    computed: {
        showQuestionEditor() {
            return this.$store.state.showQuestionEditor;
        },
        showTitleWordLimit() {
            return (this.titleInput.length > 50);
        },
        showTopicWordLimit() {
            let topicNum = this.topicInput.split(' ').length;
            return topicNum > 5;
        }
    },
    methods: {
        toggleQuestionEditor() {
            this.$store.commit('toggleQuestionEditor');
        },
        questionSubmit() {
            let title = this.titleInput;
            let topic = this.topicInput.split(' ');
            let description = this.descriptionInput;
            if (title.length > 50 || topic.length > 5) return;

            let topicHasEmpty = false;
            topic = topic.map((item) => {
                let res = item.trim();
                if (res === "") topicHasEmpty = true;
                return res;
            })
            if (topicHasEmpty) {
                this.$store.dispatch('hint', {text: '话题不能为空！', hintStatus: 'fail'})
                return;
            }

            let body = {
                title,
                topic,
                description
            }
            req('POST', '/question/addQuestion', body).then((res) => {
                this.toggleQuestionEditor();
                this.$store.dispatch('hint', {text: '提问成功！', hintStatus: 'success'})
            }).catch(err => {
                this.$store.dispatch('hint', {text: '出现未知错误！请重试！', hintStatus: 'fail'})
            })
        }
    }
}
</script>

<style>
.mask {
    background-color: rgba(0, 0, 0, .7);
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.aq-wrapper {
    width: 595px;
    max-height: calc(100vh - 24px * 2);
    background-color: #fff;
    border-radius: 3px;
    overflow: auto;
}
.aq-navTitle {
    margin-top: 40px;
    font-size: 24px;
    font-weight: 500;
    color: #1a1a1a;
    text-align: center;
}
.aq-navDescription {
    margin-top: 4px;
    font-size: 14px;
    line-height: 1.5;
    color: #8590a6;
    text-align: center;
}
.aq-content {
    padding: 0 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    font-size: 15px;
    line-height: 1.7;
}
.aq-content .aq-title {
    padding: 6px 12px;
    margin-bottom: 12px;
    resize: none;
    width: 100%;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    outline: none;
    transition: .2s;
    line-height: 24px;
    font-size: 15px;
}
.aq-content .titleWordLimit {
    align-self: flex-end;
    margin-bottom: 12px;
    color: red;
}
.aq-content .aq-topic {
    padding: 6px 12px;
    margin-bottom: 12px;
    width: 100%;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    outline: none;
    transition: .2s;
    font-size: 15px;
    line-height: 30px;
}
.aq-content .topicWordLimit {
    align-self: flex-end;
    margin-bottom: 12px;
    color: red;
}
.aq-content .aq-description {
    padding: 6px 12px;
    margin-bottom: 12px;
    resize: none;
    width: 100%;
    border: 1px solid #ebebeb;
    border-radius: 3px;
    outline: none;
    transition: .2s;
    line-height: 30px;
    font-size: 15px;
}
.aq-content .aq-title:focus,
.aq-content .aq-topic:focus,
.aq-content .aq-description:focus {
    border: 1px solid #8590a6;
}
.aq-content-hint {
    align-self: flex-start;
    margin-top: 12px;
    margin-bottom: 8px;
    padding-left: 13px;
    color: #444;
}
.questionSubmit {
    margin-top: 50px;
    width: 232px;
    line-height: 32px;
    background-color: #0084ff;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
}
.questionSubmit:hover {
    background-color: #0077e6;
}
</style>
