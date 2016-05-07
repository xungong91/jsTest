/**
 * Created by gongxun on 16/5/5.
 */
var DemoWiddgetLayer = ccui.Widget.extend({
    ccsNode : null,
    ctor: function () {
        this._super();
    },
    loadCCS : function(file){
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
    }
});