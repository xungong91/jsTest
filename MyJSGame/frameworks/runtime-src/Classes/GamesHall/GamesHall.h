//
//  GameHall.h
//  MjMobile_second
//
//  Created by gongxun on 15/4/14.
//
//

#ifndef MjMobile_second_GamesHall_h
#define MjMobile_second_GamesHall_h

#include <string>
#include "cocos2d.h"

using namespace std;

class GamesHall
{
public:
    GamesHall();
    ~GamesHall();
    
    bool openSzMjMobile();
    bool openMjMobile();
    
    bool openURL(const string &openUrl);
private:
    void openURLFail();
};
#endif
