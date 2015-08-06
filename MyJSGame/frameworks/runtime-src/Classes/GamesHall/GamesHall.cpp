//
//  GamesHall.cpp
//  MjMobile_second
//
//  Created by gongxun on 15/4/14.
//
//

#include "GamesHall.h"

GamesHall::GamesHall()
{
    
}

GamesHall::~GamesHall()
{
    
}

bool GamesHall::openSzMjMobile()
{
    return openURL("SzMjMobile://com.16youxi.SzMjMobile?a=1");
}

bool GamesHall::openMjMobile()
{
    return openURL("MjMobile://com.16youxi.MjMobile?a=1");
}