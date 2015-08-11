//
//  GameHelper.cpp
//  MyJSGame
//
//  Created by gongxun on 15/8/6.
//
//

#include "GameHelper.h"

std::vector<std::string> GameHelper::mFirstNames;
std::vector<std::string> GameHelper::mNames;

string GameHelper::getImageUrlName( const string &imageUrl )
{
    int i = 0, indexDian = 0, indexGang = 0;
    for (const char &it : imageUrl)
    {
        if (it == '.')
        {
            indexDian = i;
        }
        if (it == '/')
        {
            indexGang = i;
        }
        ++i;
    }
    string result = imageUrl.substr(indexGang + 1, indexDian - indexGang - 1);
    return result;
}

string GameHelper::saveImage(Image *image, const string &fileName)
{
    if (image)
    {
        string strResult = FileUtils::getInstance()->getWritablePath();
        strResult = strResult + fileName + ".png";
        bool isSave = image->saveToFile(strResult.c_str(), false);
        if (isSave)
        {
        }
        else
        {
            strResult = "";
        }
        return strResult;
    }
    return "";
}

bool GameHelper::getIsExistImage(const string &fileName)
{
    string strResult = FileUtils::getInstance()->getWritablePath();
    strResult = strResult + fileName + ".png";
    bool isExist = FileUtils::getInstance()->isFileExist(strResult);
    if(isExist)
    {
        
    }
    else
    {
        
    }
    return isExist;
}

string GameHelper::getImagePath(const string &fileName)
{
    string strResult = FileUtils::getInstance()->getWritablePath();
    strResult = strResult + fileName + ".png";
    return strResult;
}

vector<int> GameHelper::getRandom( int min, int max, int count )
{
    vector<int> vResult;
    random_device rd;
    for(int i = 0; i < count; i++)
    {
        int num = (rd() % (max - min + 1)) + min;
        vResult.push_back(num);
    }
    return vResult;
}

std::string GameHelper::getRandomNick()
{
    if (mFirstNames.size() == 0)
    {
        ssize_t size;
        //CLogHelper::singleton()->Log(CCFileUtils::sharedFileUtils()->fullPathForFilename("LoginRandomName.gxcopy"));
        //ifstream input(CCFileUtils::sharedFileUtils()->fullPathForFilename("LoginRandomName.gxcopy"), ios::binary);
        char* pBuffer = (char*)FileUtils::getInstance()->getFileData(FileUtils::getInstance()->fullPathForFilename("res/fonts/LoginRandomName.gxcopy").c_str(), "rt", &size);
        string temp(pBuffer, size);
        stringstream ss;
        ss<<temp;
        string it;
        string zifu = "\r\t";
        //CLogHelper::singleton()->Log("ø™ º");
        while (getline(ss, it))
        {
            //CLogHelper::singleton()->Log(it);
            string::size_type position1 = it.find_first_not_of(zifu);
            string::size_type position2 = it.find_first_of(zifu ,position1);
            string data = it.substr(position1, position2 - position1);
            if (position1 == 0)
            {
                mFirstNames.push_back(data);
                string::size_type position3 = it.find_first_not_of(zifu, position2);
                string::size_type position4 = it.find_first_of(zifu ,position3);
                string temp2 = it.substr(position3, position4 - position3);
                mNames.push_back(temp2);
            }
            else
            {
                mNames.push_back(data);
            }
        }
    }
    auto maxNum = mFirstNames.size() > mNames.size() ? mFirstNames.size() : mNames.size();
    --maxNum;
    int intFristName;
    int intName;
    vector<int> randomNum = GameHelper::getRandom(0, (int)maxNum, 2);
    if (mFirstNames.size() > mNames.size())
    {
        intFristName = randomNum[0];
        intName = (int)(randomNum[1] / maxNum * (mNames.size() - 1));
    }
    else
    {
        intFristName = (int)(((float)randomNum[0] / (float)maxNum) * (mFirstNames.size() - 1));
        intName = randomNum[1];
    }
    
    string nick =  mFirstNames[intFristName]+ mNames[intName];
    return nick;
}
























