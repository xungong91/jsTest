/**
 * Created by gongxun on 15/7/30.
 */

var loginLayer = BaseTestLayer.extend({
    ctor: function () {
        this._super();
        var file = "res/cocostudio/ccs_Login.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
        this.resetSize(this.ccsNode);

        //login button
        var Button_login = ccui.helper.seekWidgetByName(this.ccsNode, "Button_login");
        Button_login.addTouchEventListener(this.touchLoginEvent,this);

        //reg button
        var Button_frist = ccui.helper.seekWidgetByName(this.ccsNode, "Button_frist");
        Button_frist.addTouchEventListener(this.touchRegEvent,this);

        //clean
        var Button_close = ccui.helper.seekWidgetByName(this.ccsNode, "Button_close");
        Button_close.addTouchEventListener(this.touchCloseUserNameEvent,this);

        //show
        var Button_hide = ccui.helper.seekWidgetByName(this.ccsNode, "Button_hide");
        Button_hide.addTouchEventListener(this.touchShowPwdEvent,this);

        this.setPwdStyleText();
    },
    onEnter: function () {
        this._super();
    },
    onExit: function() {
        this._super();
    },
    touchRegEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.layerHelper.intoRegLayer();
        }
    },
    touchLoginEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            var username = ccui.helper.seekWidgetByName(this.ccsNode, "TextField_userName").getString();
            var pwd = ccui.helper.seekWidgetByName(this.ccsNode, "TextField_pwd").getString();

            if (username == "" || pwd == "")
            {
                this.showLoginError("用户名或密码不能为空");
                return;
            }

            //登录
            pwd = hex_md5(pwd);
            var post = "third_login_name=" + username + "&third_password=" + pwd;

            mo.httpRequestHelper.sendLogin(post,
            function (success){
                if (success){
                    mo.layerHelper.intoMainLayer();
                    mo.httpRequestHelper.sendGetInfo();
                }
                else{
                    this.showLoginError("用户名或密码错误");
                }
            }, this);
        }
    },
    touchCloseUserNameEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            ccui.helper.seekWidgetByName(this.ccsNode, "TextField_userName").setString("");
        }
    },
    touchShowPwdEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.fileHelper.saveItemOther(mo.fileHelper.keyIsShowPwd);
            this.setPwdStyleText();
        }
    },
    setPwdStyleText : function (){
        var TextField_pwd = ccui.helper.seekWidgetByName(this.ccsNode, "TextField_pwd");
        var Button_hide = ccui.helper.seekWidgetByName(this.ccsNode, "Button_hide");

        if (mo.fileHelper.readItem(mo.fileHelper.keyIsShowPwd)){
            TextField_pwd.setPasswordEnabled(true);
            TextField_pwd.setPasswordStyleText("*");
            Button_hide.loadTextureNormal("res/cocostudio/ui/image_eyeClose2.png");
            Button_hide.loadTexturePressed("res/cocostudio/ui/image_eyeClose2.png");
        }
        else{
            TextField_pwd.setPasswordEnabled(false);
            Button_hide.loadTextureNormal("res/cocostudio/ui/image_eyeClose1.png");
            Button_hide.loadTexturePressed("res/cocostudio/ui/image_eyeClose1.png");
        }
        TextField_pwd.setString(TextField_pwd.getString());
    },
    showLoginError : function(msg){
        var Image_inputError = ccui.helper.seekWidgetByName(this.ccsNode, "Image_inputError");
        Image_inputError.setVisible(true);

        ccui.helper.seekWidgetByName(this.ccsNode, "Text_inputError").setString(msg);
    }
});