package com.examerapp;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.hc.card.CardPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.brentvatne.react.ReactVideoPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.yoloci.fileupload.FileUploadPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.keyee.pdfview.PDFView;
import com.github.yamill.orientation.OrientationPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.imagepicker.ImagePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.rnfs.RNFSPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import cn.jpush.reactnativejanalytics.JAnalyticsPackage;
import cn.jpush.reactnativejpush.JPushPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    private boolean SHUTDOWN_TOAST = true;
    private boolean SHUTDOWN_LOG = true;

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new CardPackage(),
            new RNZipArchivePackage(),
            new ReactVideoPackage(),
            new VectorIconsPackage(),
            new FileUploadPackage(),
            new SplashScreenReactPackage(),
            new PDFView(),
            new OrientationPackage(),
            new LinearGradientPackage(),
            new ImagePickerPackage(),
            new PickerPackage(),
            new RNI18nPackage(),
            new RNFSPackage(),
            new ReactNativeAudioPackage(),
            new JAnalyticsPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG),
              new JPushPackage(SHUTDOWN_TOAST, SHUTDOWN_LOG)
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
