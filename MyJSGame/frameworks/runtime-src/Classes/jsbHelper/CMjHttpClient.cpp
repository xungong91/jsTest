#include "CMjHttpClient.h"
#include "GameHelper.h"
#include "CHttpImageSprite.h"

USING_NS_CC_EXT;

CMjHttpClient::CMjHttpClient()
{
    float connectTimeout = 10.0f;
    float readTimeout = 5.0f;
	HttpClient::getInstance()->setTimeoutForConnect(connectTimeout);
	HttpClient::getInstance()->setTimeoutForRead(readTimeout);
}

CMjHttpClient::~CMjHttpClient()
{
    HttpClient::destroyInstance();
	mHttpClient = NULL;
}

CMjHttpClient::CGarbo CMjHttpClient::Garbo;

CMjHttpClient* CMjHttpClient::mHttpClient = NULL;

CMjHttpClient* CMjHttpClient::Singleton()
{
	if (mHttpClient == NULL)
	{
		mHttpClient = new CMjHttpClient();
	}
	return mHttpClient;
}

void CMjHttpClient::sendPostHtml(const string &url, const string &postData, const ccHttpRequestCallback& callback )
{
	sendPostHtml(url, postData, callback, "null");
}

void CMjHttpClient::sendPostHtml( const string &url,const string &postData, const ccHttpRequestCallback& callback, const string &tag )
{
    string newPostData = postData;
    HttpRequest* request = new (std::nothrow) HttpRequest();
	request->setUrl(url.c_str());
    request->setRequestType(HttpRequest::Type::POST);
    std::vector<std::string> headers = getHeaders(newPostData);
	request->setHeaders(headers);
	request->setResponseCallback(callback);

	//attribute
    size_t postLenght(0);
#if (CC_TARGET_PLATFORM == CC_PLATFORM_ANDROID)
    postLenght = newPostData.size();
#else
    postLenght = newPostData.size() + 1;
#endif
	request->setRequestData(newPostData.c_str(), postLenght);
    //tag
	request->setTag(tag.c_str());
    //send
//	string RequestData(request->getRequestData(), request->getRequestDataSize());
    HttpClient::getInstance()->send(request);
    request->release();
}

void CMjHttpClient::sendGetHtml(const string &url, const ccHttpRequestCallback& callback )
{
	sendGetHtml(url, callback, "TEST", "");
}

void CMjHttpClient::sendGetHtml( const string &url, const ccHttpRequestCallback& callback, const string &tag )
{
	sendGetHtml(url, callback, tag, "");
}

void CMjHttpClient::sendGetHtml( const string &url, const ccHttpRequestCallback& callback, const string &tag, const string &host )
{
	HttpRequest* request = new HttpRequest();
	request->setUrl(url.c_str());
    request->setRequestType(HttpRequest::Type::GET);
	std::vector<std::string> headers = getHeaders("", host);
	request->setHeaders(headers);
	request->setResponseCallback(callback);
	request->setTag(tag.c_str());
	HttpClient::getInstance()->send(request);

	for (string s : request->getHeaders())
	{
//		CCLog(s.c_str());
	}
	request->release();
}

vector<string> CMjHttpClient::getHeaders( const string &table)
{
	return getHeaders(table, "");
}

vector<string> CMjHttpClient::getHeaders( const string &table, const string &host )
{
	vector<std::string> headers;
	headers.push_back("User-Agent: Mozilla/5.0 (Windows NT 6.3; WOW64; rv:28.0) Gecko/20100101 Firefox/28.0");
	headers.push_back("Content-Type: application/x-www-form-urlencoded; charset=UTF-8");
	headers.push_back(CCString::createWithFormat("Content-Length: %lu", table.size())->getCString());
	headers.push_back("Connection: keep-alive");

	return headers;
}

bool CMjHttpClient::detectResponse( HttpResponse *response )
{
	bool result = detectResponseNot(response);
//	CBreakHelper::singleton()->setBreak(!result);

	return result;
}

bool CMjHttpClient::detectResponseNot( HttpResponse *response )
{
	bool result = true;
	if (!response)
	{
		result = false;
	}
	// You can get original request type from: response->request->reqType
	if (0 != strlen(response->getHttpRequest()->getTag())) 
	{
//		CCLog("%s completed", response->getHttpRequest()->getTag());
	}

	int statusCode = response->getResponseCode();
	char statusString[64] = {};

	if (!response->isSucceed()) 
    {
        sprintf(statusString, "HTTP Status Code: %d, tag = %s", statusCode, response->getHttpRequest()->getTag());
        CCLOG("response code: %d", statusCode);
		CCLOG("response failed");
		CCLOG("error buffer: %s", response->getErrorBuffer());
		result = false;
	}
	return result;
}

void CMjHttpClient::onGetHtmlImage(const string &imageUrl, const string &imageTag)
{
    sendGetHtml(imageUrl, CC_CALLBACK_2(CMjHttpClient::onGetHtmlImageRequestCompleted, this), imageTag);
}

void CMjHttpClient::onGetHtmlImageRequestCompleted(HttpClient *sender, HttpResponse *response)
{
    bool isSuccess = detectResponseNot(response);
    // dump data
    vector<char> *buffer = response->getResponseData();
    string sBuffer(buffer->begin(), buffer->end());
    
    const string &tag = response->getHttpRequest()->getTag();
    if (isSuccess)
    {
        string imageFile;
        do
        {
            Image* img = new Image;
            bool isImage = img->initWithImageData((unsigned char*)buffer->data(),buffer->size());
            if (!isImage)
            {
                break;
            }
            string url = response->getHttpRequest()->getUrl();
            string imageName = GameHelper::getImageUrlName(url);
            //save image
            imageFile = GameHelper::saveImage(img, imageName);
            
            CHttpImageSprite::setImageFile(imageFile, tag);
            
            return;
        }
        while (true);
    }
}





