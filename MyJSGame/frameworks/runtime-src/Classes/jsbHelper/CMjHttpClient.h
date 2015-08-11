#ifndef _C_MJ_HTTP_CLIENT_H_
#define _C_MJ_HTTP_CLIENT_H_

#include "cocos2d.h"
#include <iostream>
#include <string>
#include <vector>
#include <map>
#include "extensions/cocos-ext.h"
#include "network/HttpClient.h"

using namespace std;
USING_NS_CC;
using namespace network;

class CMjHttpClient : public Ref
{
public:
	static CMjHttpClient* Singleton();
    //下载图片
    void onGetHtmlImage(const string &imageUrl, const string &imageTag);
private:
    //下载图片的回调
    void onGetHtmlImageRequestCompleted(HttpClient *sender, HttpResponse *response);

	//填充表头
	vector<string> getHeaders(const string &table);
	vector<string> getHeaders(const string &table, const string &host);
	//发送get html请求
	void sendPostHtml(const string &url,const string &postData, const ccHttpRequestCallback& callback);
	void sendPostHtml(const string &url,const string &postData, const ccHttpRequestCallback& callback, const string &tag);
	//发送post html请求
	void sendGetHtml(const string &url, const ccHttpRequestCallback& callback);
	void sendGetHtml(const string &url, const ccHttpRequestCallback& callback, const string &tag);
	void sendGetHtml(const string &url, const ccHttpRequestCallback& callback, const string &tag, const string &host);
	//判断返回时候合法
	bool detectResponse(HttpResponse *response);
	//判断不需要出发短线重连
	bool detectResponseNot(HttpResponse *response);

	static CMjHttpClient* mHttpClient;
	~CMjHttpClient();
	CMjHttpClient();
	class CGarbo
	{  
	public:  
		~CGarbo()  
		{  
			if (mHttpClient)  
				delete mHttpClient;  
		}  
	};  
	static CGarbo Garbo;

};

#endif