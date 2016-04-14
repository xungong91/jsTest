/**
 * Created by gongxun on 16/4/14.
 */

var GameHelper = function(){
    var that = [];

    that.createIntArray = function (row, col, defalut){
        var arr = [];
        for (var i = 0; i < row; i++ )
        {
            arr[i] = [];
            for (var j = 0; j < col; j++){
                arr[i][j] = defalut;
            }
        }
        return arr;
    };

    return that;
};

mo.gameHelper = new GameHelper();