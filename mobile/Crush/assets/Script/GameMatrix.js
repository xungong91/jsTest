cc.Class({
    extends: cc.Component,

    properties: {
        title: {
            default: null,
            type: cc.Label
        },
        titleText: ""
    },

    // use this for initialization
    onLoad: function () {
        this.title.string = this.titleText;
        cc.log("test");
        console.log("asdadsa");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
