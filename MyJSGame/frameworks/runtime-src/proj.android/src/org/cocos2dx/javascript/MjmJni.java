package org.cocos2dx.javascript;

import org.cocos2dx.javascript.AppActivity;

import android.content.Intent;
import android.util.Log;

public class MjmJni {

	public static AppActivity mMainContext;

	//打开app
	public static boolean openURL(String packname)
	{
	    Log.d("debug", packname);
		Intent intent = mMainContext.getPackageManager().getLaunchIntentForPackage(packname);
		// 这里如果intent为空，就说名没有安装要跳转的应用嘛
		if (intent != null) 
		{
		    // 这里跟Activity传递参数一样的嘛，不要担心怎么传递参数，还有接收参数也是跟Activity和Activity传参数一样
		    intent.putExtra("canshu1", packname);
		    mMainContext.startActivity(intent);
		    Log.d("debug", "成功");
		    return true;
		} 
		else 
		{
//			openURLFail();
		    Log.d("debug", "失败");
		    return false;
		}
	}
}
