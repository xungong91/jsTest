//
//  CHttpImageSprite.cpp
//  MjMobile_second
//
//  Created by gongxun on 15/6/17.
//
//

#include "CHttpImageSprite.h"
#include "CMjHttpClient.h"
#include "GameHelper.h"
#include "cocostudio/CocoStudio.h"
#include "ui/CocosGUI.h"

using namespace ui;

list<CHttpImageSprite*> CHttpImageSprite::mHttpImageSprites;

CHttpImageSprite::CHttpImageSprite()
: mSize(Size::ZERO)
{
    mHttpImageSprites.push_back(this);
}

CHttpImageSprite::~CHttpImageSprite()
{
    mHttpImageSprites.remove(this);
}

bool CHttpImageSprite::init()
{
    if (!Sprite::init())
    {
        return false;
    }
    
    return true;
}

void CHttpImageSprite::setImage(const string &fileName)
{
//    CCLOG(fileName.c_str());
    
    this->stopAllActions();
    this->setRotation(0);
    this->initWithFile(fileName);
    
    this->setAnchorPoint(Point(0, 0));
    this->setPosition(Point(0, 0));
    
    if ((mSize.width != 0) || (mSize.height != 0))
    {
        float w = mSize.width / this->getContentSize().width;
        float h = mSize.height / this->getContentSize().height;
        this->setScaleX(w);
        this->setScaleY(h);
    }
}

void CHttpImageSprite::setLoding()
{
    this->initWithFile("res/load_image.png");
    this->runAction(RepeatForever::create(Sequence::create(RotateBy::create(2, 360), NULL)));
}

bool CHttpImageSprite::setCode(const string &url)
{
    static int code = 0;
    bool isExist = false;
    for (auto it : mHttpImageSprites)
    {
        if (it->getUrl() == url && it != this)
        {
            isExist = true;
            mCode = it->getCode();
            break;
        }
    }
    if (!isExist)
    {
        char data[100];
        sprintf(data, "%d", code);
        mCode = data;
        ++code;
    }
    return isExist;
}

string CHttpImageSprite::getCode()
{
    return mCode;
}

void CHttpImageSprite::setUrl(const string &url)
{
    mUrl = url;
}

string CHttpImageSprite:: getUrl()
{
    return mUrl;
}

//
//static
//

Sprite *CHttpImageSprite::loadHttpImageForParent(Node *parent, const string &url, Size size)
{
    if (typeid(*parent) == typeid(ImageView))
    {
        ImageView *imageView = static_cast<ImageView*>(parent);
        imageView->loadTexture("res/Transparent.png");
        imageView->setContentSize(size);
        CCLOG("设为空");
    }
    
    CHttpImageSprite *sprite = CHttpImageSprite::create();
    sprite->setPosition(Point(size.width / 2, size.height / 2));
    sprite->setFinshidSize(size);
    sprite->setUrl(url);
    parent->addChild(sprite);
    
    loadImage(sprite, url);
    return sprite;
}

void CHttpImageSprite::loadImage(CHttpImageSprite *sprite, const string &url)
{
    string imageName = GameHelper::getImageUrlName(url);
    if (GameHelper::getIsExistImage(imageName))
    {
        //直接加载
        string fileName = GameHelper::getImagePath(imageName);
        sprite->setImage(fileName);
    }
    else
    {
        sprite->setLoding();
        //下载
        if (!sprite->setCode(url))
        {
            //没有在下载才开始下载
            CMjHttpClient::Singleton()->onGetHtmlImage(url, sprite->getCode());
        }
    }
}

void CHttpImageSprite::setImageFile(const string &fileName, const string &code)
{
    for (auto it : mHttpImageSprites)
    {
        if (it->getCode() == code)
        {
            it->setImage(fileName);
        }
    }
}



















