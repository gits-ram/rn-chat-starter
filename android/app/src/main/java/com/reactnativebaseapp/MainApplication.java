package com.reactnativebaseapp;

import android.app.Application;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

//Unused, since we now use ReactNavigationApplication
import com.facebook.react.ReactApplication;
import com.oblador.vectoricons.VectorIconsPackage;
//Lib for Native Splash Screens
import com.reactnativecomponent.splashscreen.RCTSplashScreenPackage;
//Lib for RN loader Animations
import com.react.rnspinkit.RNSpinkitPackage;
//React Native Navigation
import com.reactnativenavigation.NavigationApplication;
//React Native Audio Recorder
import com.rnim.rn.audio.ReactNativeAudioPackage;
//React Native Audio Playback
import com.zmxv.RNSound.RNSoundPackage;
//React Native File System
import com.rnfs.RNFSPackage;
//React Native Camera
import org.reactnative.camera.RNCameraPackage;

public class MainApplication extends NavigationApplication {

  //  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
  //    @Override
  //    public boolean getUseDeveloperSupport() {
  //      return BuildConfig.DEBUG;
  //    }
  //}

  //    @Override
  protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(/*new MainReactPackage(),*/ new VectorIconsPackage(),
        new RCTSplashScreenPackage(), //splash screen module
        new RNSpinkitPackage(), //Spinner Animation
        new ReactNativeAudioPackage(), //Audio Recorder
        new RNSoundPackage(), //Sound Playback
        new RNFSPackage(), // File System
             new RNCameraPackage() //Camera
    );
  }

  @Override
  public List<ReactPackage> createAdditionalReactPackages() {
    return getPackages();
  }

  @Override
  public boolean isDebug() {
    // Make sure you are using BuildConfig from your own application
    return BuildConfig.DEBUG;
  }

  @Override
  public String getJSMainModuleName() {
    return "index";
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
