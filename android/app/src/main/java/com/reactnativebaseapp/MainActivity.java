package com.reactnativebaseapp;

import android.os.Bundle;
import android.widget.ImageView;

//Unused, since we are using React-Native-Navigation
import com.facebook.react.ReactActivity;
//Splash Screen lib import
import com.reactnativecomponent.splashscreen.RCTSplashScreen;
//React Native Navigation import
import com.reactnativenavigation.controllers.SplashActivity;

public class MainActivity extends SplashActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // RCTSplashScreen.openSplashScreen(this); //open splashscreen
        RCTSplashScreen.openSplashScreen(this, true, ImageView.ScaleType.FIT_XY); //open splashscreen fullscreen
        super.onCreate(savedInstanceState);
    }

    /**  UNUSED When using React-native-navigation
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
//    @Override
//    protected String getMainComponentName() {
//        return "ReactNativeBaseApp";
//    }
}
