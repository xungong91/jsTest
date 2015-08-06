/**
 * Created by gongxun on 15/7/16.
 */

var BaseEntity= function (opt) {
    var that = MyObj();

    that.inheritOn('bbbb', function (config)
    {
        cc.log("base_entity");
        return true;
    });

    return that;
};