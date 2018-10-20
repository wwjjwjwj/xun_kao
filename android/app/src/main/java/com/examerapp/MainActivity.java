package com.examerapp;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.view.WindowManager;

import com.facebook.react.ReactActivity;

import org.devio.rn.splashscreen.SplashScreen;
import com.hc.card.CardModule;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "ExamerApp";
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        Intent intent = new Intent("onConfigurationChanged");
        intent.putExtra("newConfig", newConfig);
        this.sendBroadcast(intent);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
        //JPushInterface.init(this);
        //JPushInterface.setDebugMode(true);

    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data){

        CardModule.setBlueAddress(requestCode, resultCode, data);

    }
}
