<template>
    <div class="hintWrapper">
        <transition name="fade">
            <div v-show="showHint" class="hint" :class="hintStatus">
                <div class="hintText" >{{hintText}}</div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    computed: {
        showHint() {
            return this.$store.state.showHint.show;
        },
        hintText() {
            return this.$store.state.showHint.text;
        },
        hintStatus() {
            return this.$store.state.showHint.hintStatus;
        }
    }
}
</script>

<style>
.hintWrapper {
    position: fixed;
    z-index:5;
}
.hint {
    position: fixed;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    font-weight: bold;
    font-size: 20px;
    padding: 7px 30px;
    border-radius: 6px;
    transition-duration: 0.5s;
}
.hint.success {
    background-color: rgb(25,137,250);
}
.hint.fail {
    background-color: rgb(255, 97, 97);
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
}
.fade-enter, .fade-leave-active {
    opacity: 0;
}
</style>
