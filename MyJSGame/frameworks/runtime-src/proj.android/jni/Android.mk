LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_MODULE := cocos2djs_shared

LOCAL_MODULE_FILENAME := libcocos2djs

FILE_LIST := hellojavascript/main.cpp \
FILE_LIST += ../../Classes/AppDelegate.cpp 
FILE_LIST += ../../Classes/GamesHall/*.cpp)
FILE_LIST += ../../Classes/GamesHall/Android/*.cpp)
FILE_LIST += ../../Classes/jsbHelper/*.cpp)


LOCAL_SRC_FILES := $(FILE_LIST:$(LOCAL_PATH)/%=%)
	
LOCAL_C_INCLUDES := $(shell find $(LOCAL_PATH)/../../Classes -type d)

LOCAL_STATIC_LIBRARIES := cocos_jsb_static

LOCAL_EXPORT_CFLAGS := -DCOCOS2D_DEBUG=2 -DCOCOS2D_JAVASCRIPT

include $(BUILD_SHARED_LIBRARY)


$(call import-module,bindings)
