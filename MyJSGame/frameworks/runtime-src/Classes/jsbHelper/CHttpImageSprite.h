//
//  CHttpImageSprite.h
//  MjMobile_second
//
//  Created by gongxun on 15/6/17.
//
//

#ifndef __MjMobile_second__CHttpImageSprite__
#define __MjMobile_second__CHttpImageSprite__

#include "cocos2d.h"
#include <string>
#include <list>

USING_NS_CC;
using namespace std;

class CHttpImageSprite : public Sprite
{
public:
    CHttpImageSprite();
    ~CHttpImageSprite();
    CREATE_FUNC(CHttpImageSprite);
    bool init();
    //下载完成 或者已经存在
    void setImage(const string &fileName);
    
    ////未下载时候用的
    void setLoding();
    //返回是否是新的
    bool setCode(const string &url);
    string getCode();
    void setUrl(const string &url);
    string getUrl();
    void setFinshidSize(Size size) { mSize = size; }
public:
    static list<CHttpImageSprite*> mHttpImageSprites;
    
    static Sprite *loadHttpImageForParent(Node *parent, const string &url, Size size);
    //加载图片
    static void loadImage(CHttpImageSprite *sprite, const string &url);
    //设置图片
    static void setImageFile(const string &fileName, const string &code);
private:
    //下载图片的标志
    string mCode;
    string mUrl;
    Size mSize;
};


#endif /* defined(__MjMobile_second__CHttpImageSprite__) */
