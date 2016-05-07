/**
 * Created by gongxun on 16/5/3.
 */

var HallBaseLayer = cc.Layer.extend({
    ctor: function () {
        this._super();
    },
    resetSize: function (node) {
        node.setContentSize(mo.curSize.width, mo.curSize.height);
        ccui.helper.doLayout(node);
    }
});