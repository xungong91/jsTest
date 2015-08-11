/**
 * Created by gongxun on 15/8/10.
 */

var pageSelectSprite = BaseSprite.extend({
    page : null,

    ctor: function () {
        this._super();


    },
    onExit: function () {
        this._super();
    },
    onEnter: function () {
        this._super();
    },
    setPage : function (page){
        this.page = page;
        page.addEventListener(this.pageViewEvent, this);

        this.setSelectSprite();
    },
    setPageNotListener : function (page){
        this.page = page;

        this.setSelectSprite();
    },
    pageViewEvent: function (sender, type) {
        switch (type) {
            case ccui.PageView.EVENT_TURNING:
                this.setSelectSprite();
                break;
            default:
                break;
        }
    },
    setSelectSprite : function (){
        var curIndex = this.page.getCurPageIndex();
        var count = this.page.getPages().length;

        var childs = this.getChildren();
        var childCount = childs.length;

        //保持child长度和count一致
        if (childs.length == count){

        }
        else if (childs.length > count){
            //remove
            for (var i = 0; i < childCount - count; i++){
                this.removeChild(childs[i]);
            }
        }
        else{
            //add
            for (var i = 0; i < count - childCount; i++){
                this.addChild(new cc.Sprite());
            }
        }

        //sort
        childs = this.getChildren();
        childCount = childs.length;
        for (var i = 0; i < childCount; i++){
            var offsetx = 30;
            var p = cc.p((childCount - 1) * (- offsetx / 2) + i * offsetx, 0);

            childs[i].setPosition(p);
            if (curIndex == i){
                childs[i].initWithFile("res/cocostudio/ui/page_select1.png");
            }
            else{
                childs[i].initWithFile("res/cocostudio/ui/page_select2.png");
            }
        }
    },

});