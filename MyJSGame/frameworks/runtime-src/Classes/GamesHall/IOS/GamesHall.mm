//
//  GamesHall.m
//  MjMobile_second
//
//  Created by gongxun on 15/4/14.
//
//

#import <Foundation/Foundation.h>
#include "GamesHall.h"

bool GamesHall::openURL(const string &openUrl)
{
    NSURL *url = [NSURL URLWithString:[NSString stringWithUTF8String:openUrl.c_str()]];
    if ([[UIApplication sharedApplication] canOpenURL:url])
    {
        [[UIApplication sharedApplication] openURL:url];
        return true;
    }
    else
    {
        openURLFail();
        return false;
    }
}

void GamesHall::openURLFail()
{
    cocos2d::MessageBox("未安装卡五星", "title");
    [[UIApplication sharedApplication] openURL:[NSURL URLWithString:@"itms-apps://itunes.apple.com/cn/app/xin-feng-wu-han-ma-jiang/id917551498?l=zh&ls=1&mt=8"]];
}