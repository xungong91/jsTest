//
//  GamesHall.cpp
//  MjMobile_second
//
//  Created by gongxun on 15/4/14.
//
//

#include "GamesHall.h"
#include "cocos2d.h"

USING_NS_CC;

#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
#include "platform/android/jni/JniHelper.h"

extern "C"
{
    void Java_org_cocos2dx_cpp_MjmJni_openURLFail(JNIEnv *env, jobject thiz)
    {
        //        openURLFail();
        cocos2d::MessageBox("未安装卡五星", "title");
    }
}

bool GamesHall::openURL(const string &openUrl)
{
    JniMethodInfo jmi;
    if(JniHelper::getStaticMethodInfo(jmi , "org/cocos2dx/javascript/MjmJni" , "openURL" , "(Ljava/lang/String;)Z"))
    {
        jstring str_reg = jmi.env->NewStringUTF(openUrl.c_str());
        
        jboolean b = jmi.env->CallStaticBooleanMethod(jmi.classID , jmi.methodID , str_reg);
        
        return b;
    }
    else
    {
        return false;
    }
}

void GamesHall::openURLFail()
{
//    cocos2d::MessageBox("未安装卡五星", "title");
}


#endif
