/**
 * Created by gongxun on 15/8/3.
 */

var regLayer = BaseTestLayer.extend({
    TextField_name : null,
    TextField_nick : null,
    TextField_pwd : null,
    isTextFiledCheck : false,

    ctor: function () {
        this._super();
        var node,
            file = "res/cocostudio/ccs_reg.json";
        cc.log("ccs.load : %s", file);
        var json = ccs.load(file);
        this.ccsNode = json.node;
        this.addChild(this.ccsNode);
        this.resetSize(this.ccsNode);

        //init
        this.TextField_name = ccui.helper.seekWidgetByName(this.ccsNode, "TextField_name");
        this.TextField_name.addEventListener(this.textFieldEvent, this);

        this.TextField_nick = ccui.helper.seekWidgetByName(this.ccsNode, "TextField_nick");
        this.TextField_nick.addEventListener(this.textFieldEvent, this);

        this.TextField_pwd = ccui.helper.seekWidgetByName(this.ccsNode, "TextField_pwd");
        this.TextField_pwd.addEventListener(this.textFieldEvent, this);

        //back button
        var Button_back = ccui.helper.seekWidgetByName(this.ccsNode, "Button_back");
        Button_back.addTouchEventListener(this.touchBackEvent,this);

        //隐藏显示
        this.setPwdStyleText();
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_hidePwd").addTouchEventListener(this.touchShowPwdEvent,this);

        //clean
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_nameClose").addTouchEventListener(this.touchUserNameEvent,this);
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_nickClose").addTouchEventListener(this.touchCloseNickNameEvent,this);

        //random
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_random").addTouchEventListener(this.touchRandomEvent,this);

        //reg
        ccui.helper.seekWidgetByName(this.ccsNode, "Button_frist").addTouchEventListener(this.touchRegEvent,this);

    },
    onEnter: function () {
        this._super();
    },
    onExit: function() {
        this._super();
    },
    checkInput : function(){

        this.isTextFiledCheck = true;

        //用户名
        var nameValue = this.TextField_name.getString();
        var nameImage = ccui.helper.seekWidgetByName(this.ccsNode, "Image_tishi_name");
        var nameText = ccui.helper.seekWidgetByName(this.ccsNode, "Text_tishi_name");
        if (!mo.gameHelper.checkFormatUserName(nameValue)) {
            this.isTextFiledCheck = false;
            nameText.setString("请输入6-14位英文或数字");
            nameImage.loadTexture("res/cocostudio/ui/image_warring.png");
        }
        else{
            nameText.setString("用户名输入完成");
            nameImage.loadTexture("res/cocostudio/ui/image_ok.png");
        }
        nameImage.setVisible(true);

        //昵称
        var nickValue = this.TextField_nick.getString();
        var nickImage = ccui.helper.seekWidgetByName(this.ccsNode, "Image_tishi_nick");
        var nickText = ccui.helper.seekWidgetByName(this.ccsNode, "Text_tishi_nick");
        if (!mo.gameHelper.checkFormatNick(nickValue)) {
            this.isTextFiledCheck = false;
            nickText.setString("请输入3-6位中文");
            nickImage.loadTexture("res/cocostudio/ui/image_warring.png");
        }
        else{
            nickText.setString("昵称输入完成");
            nickImage.loadTexture("res/cocostudio/ui/image_ok.png");
        }
        nickImage.setVisible(true);

        //密码
        var pwdValue = this.TextField_pwd.getString();
        var pwdImage = ccui.helper.seekWidgetByName(this.ccsNode, "Image_tishi_pwd");
        var pwdText = ccui.helper.seekWidgetByName(this.ccsNode, "Text_tishi_pwd");
        if (!mo.gameHelper.checkFormatUserName(pwdValue)) {
            this.isTextFiledCheck = false;
            pwdText.setString("请输入3-6位中文");
            pwdImage.loadTexture("res/cocostudio/ui/image_warring.png");
        }
        else{
            pwdText.setString("登录密码输入完成");
            pwdImage.loadTexture("res/cocostudio/ui/image_ok.png");
        }
        pwdImage.setVisible(true);

    },
    textFieldEvent: function (textField, type) {
        switch (type) {
            case ccui.TextField. EVENT_ATTACH_WITH_IME:
                break;
            case ccui.TextField. EVENT_DETACH_WITH_IME:
                this.checkInput();
                break;
            case ccui.TextField. EVENT_INSERT_TEXT:
                break;
            case ccui.TextField. EVENT_DELETE_BACKWARD:
                break;
            default:
                break;
        }
    },
    touchBackEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.layerHelper.intoLoginLayer();
        }
    },
    setPwdStyleText : function (){
        var Button_hide = ccui.helper.seekWidgetByName(this.ccsNode, "Button_hidePwd");

        if (mo.fileHelper.readItem(mo.fileHelper.keyIsShowPwd)){
            this.TextField_pwd.setPasswordEnabled(true);
            this.TextField_pwd.setPasswordStyleText("*");
            Button_hide.loadTextureNormal("res/cocostudio/ui/image_eyeClose2.png");
            Button_hide.loadTexturePressed("res/cocostudio/ui/image_eyeClose2.png");
        }
        else{
            this.TextField_pwd.setPasswordEnabled(false);
            Button_hide.loadTextureNormal("res/cocostudio/ui/image_eyeClose1.png");
            Button_hide.loadTexturePressed("res/cocostudio/ui/image_eyeClose1.png");
        }
        this.TextField_pwd.setString(this.TextField_pwd.getString());
    },
    touchShowPwdEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            mo.fileHelper.saveItemOther(mo.fileHelper.keyIsShowPwd);
            this.setPwdStyleText();
        }
    },
    touchUserNameEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            this.TextField_name.setString("");
            this.checkInput();
        }
    },
    touchCloseNickNameEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            this.TextField_nick.setString("");
            this.checkInput();
        }
    },
    touchRandomEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){
            this.TextField_nick.setString("哈哈哈哈");
            this.checkInput();
        }
    },
    touchRegEvent: function (sender, type) {
        if (type == ccui.Widget.TOUCH_ENDED){

            this.checkInput();

            if ( !this.isTextFiledCheck ){
                mo.roomMsgHelper.showMsg("输入有误");
                return;
            }

            if ( !ccui.helper.seekWidgetByName(this.ccsNode, "CheckBox_read").isSelected() ){
                mo.roomMsgHelper.showMsg("没有勾选用户协议");
                return;
            }

            //发送消息

        }
    }
});