'use strict';

//const Parse = require('parse/react-native');
const { Platform } = require('react-native');

import Ajax from '../common/ajax';
import { Toast } from 'antd-mobile-rn';

//总部首页资讯
export function information_Home_list(isZb, pageIndex, pageSize) {
    return (dispatch) => {
        const promise = Ajax.promisePostJson("Zixun/InformationHomeList", { isZb: isZb, PageIndex: pageIndex, PageSize: pageSize });
        promise.then((result) => {
            const action = {
                type: 'INFORMATION_HOME_LIST',
                data: result.data
            }
            dispatch(action);
        });
        return promise;
    };
}