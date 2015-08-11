//
//  GameHelper.h
//  MyJSGame
//
//  Created by gongxun on 15/8/6.
//
//

#ifndef __MyJSGame__GameHelper__
#define __MyJSGame__GameHelper__

#include <string>
#include <vector>
#include "cocos2d.h"

using namespace std;
USING_NS_CC;

class GameHelper
{
public:
    static string getImageUrlName(const string &imageUrl);
    static string saveImage(Image *image, const string &fileName);
    static bool getIsExistImage(const string &fileName);
    static string getImagePath(const string &fileName);
    static vector<int> getRandom(int min, int max, int count);
    
    static std::string getRandomNick();
private:
    static std::vector<std::string> mFirstNames;
    static std::vector<std::string> mNames;
};

#endif /* defined(__MyJSGame__GameHelper__) */
