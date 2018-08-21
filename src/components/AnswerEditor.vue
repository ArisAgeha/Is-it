<template>
    <div class="mask" v-if="showAnswerEditor" @click="toggleAnswerEditor">
        <div class="aa-wrapper" @click.stop>
            <h3 class="aa-navTitle">写下你的答案</h3>
            <div class="aa-navDescription">回答的同时请尊重他人的答案</div>
            <div class="aa-content">
                <textarea class="aa-description" type="text" v-model="descriptionInput"></textarea>
                <button class="answerSubmit" @click="answerSubmit">提交</button>
            </div>
        </div>
    </div>
</template>

<script>
let req = require('../models/req.js');
export default {
    props: ['questionID'],
    data() {
        return {
            titleInput: '',
            topicInput: '',
            descriptionInput: ''
        }
    },
    computed: {
        showAnswerEditor() {
            return this.$store.state.showAnswerEditor;
        }
    },
    methods: {
        toggleAnswerEditor() {
            this.$store.commit('toggleAnswerEditor');
        },
        answerSubmit() {
            let content = this.descriptionInput;
            let ellipsis = '';
            let questionID = this.questionID;
            if (content.length > 100) ellipsis = content.slice(0, 100);
            if (content.length === 0) {
                this.$store.dispatch('hint', {text: '内容不能为空！', hintStatus: 'fail'});
                return;
            }

            let body = {
                content,
                ellipsis,
                questionID
            }
            req('POST', '/answer/addAnswer', body).then((res) => {
                this.toggleAnswerEditor();
                this.$store.dispatch('hint', {text: '已添加回答！', hintStatus: 'success'})
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
.aa-wrapper {
    width: 595px;
    max-height: calc(100vh - 24px * 2);
    background-color: #fff;
    border-radius: 3px;
    overflow: auto;
}
.aa-navTitle {
    margin-top: 40px;
    font-size: 24px;
    font-weight: 500;
    color: #1a1a1a;
    text-align: center;
}
.aa-navDescription {
    margin-top: 4px;
    font-size: 14px;
    line-height: 1.5;
    color: #8590a6;
    text-align: center;
}
.aa-content {
    padding: 0 24px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 24px;
    font-size: 15px;
    line-height: 1.7;
}
.aa-content .aa-title {
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
.aa-content .titleWordLimit {
    align-self: flex-end;
    margin-bottom: 12px;
    color: red;
}
.aa-content .aa-topic {
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
.aa-content .topicWordLimit {
    align-self: flex-end;
    margin-bottom: 12px;
    color: red;
}
.aa-content .aa-description {
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
.aa-content .aa-title:focus,
.aa-content .aa-topic:focus,
.aa-content .aa-description:focus {
    border: 1px solid #8590a6;
}
.aa-content-hint {
    align-self: flex-start;
    margin-top: 12px;
    margin-bottom: 8px;
    padding-left: 13px;
    color: #444;
}
.answerSubmit {
    margin-top: 50px;
    width: 232px;
    line-height: 32px;
    background-color: #0084ff;
    border-radius: 3px;
    color: #fff;
    cursor: pointer;
}
.answerSubmit:hover {
    background-color: #0077e6;
}
</style>
