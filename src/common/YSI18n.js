/**
 * Created by Administrator on 4/25/2017.
 * @flow
 * @providesModule YSI18n
 */

import React from 'react';
import I18n from 'react-native-i18n'

const deviceLocale = I18n.locale;
console.log('locale:' + deviceLocale);

//ant-design 多语言包环境配置
import LocaleContext from '../locale/index';

I18n.fallbacks = true;
var translations = {};
//整合业务多语言包
LocaleContext.supportLocales.map((item) => {
    var locale = item.locale;
    var app = item.App;
    eval(`(translations.${locale}=app)`)
});
I18n.translations = translations;
class YSI18n extends React.Component {
    static get(name) {
        I18n.locale = global.locale || 'zh';
        return I18n.t(name, { defaultValue: name });
    }
};

module.exports = YSI18n;
