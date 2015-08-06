/**
 * Created by gongxun on 15/7/30.
 */


var BaseTestLayer = cc.LayerGradient.extend({
    ccsNode : null,

    ctor: function () {
        if (arguments.length === 0) {
            this._super(cc.color(0, 0, 0, 255), cc.color(98, 99, 117, 255));
        } else {
            this._super.apply(this, arguments);
        }
    },
    onExit: function () {
        ccs.armatureDataManager.clear();
        ccs.sceneReader.clear();
        ccs.actionManager.clear();
        ccs.uiReader.clear();
        this._super();
    },
    resetSize: function (node) {
        node.setContentSize(mo.curSize.x, mo.curSize.y);
        ccui.helper.doLayout(node);
        console.log(mo.curSize.x);
        console.log(mo.curSize.y);
    }
});