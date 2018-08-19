
/*
* @flow
* @providesModule YSToast
*/


import React from 'react';
import ToastContainer from 'antd-mobile-rn/lib/toast/ToastContainer.native';

class YSToast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hide: true,//默认隐藏
        }
    };
    render() {
        if (this.state.hide) {
            return null;
        }
        else {
            return <ToastContainer {...this.state.noticeOptions} />
        }
    }
    notice(content, type) {
        var duration = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
        var onClose = arguments[3];
        var mask = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
        this.setState({
            noticeOptions: {
                content: content,
                duration: duration,
                onClose: onClose,
                type: type,
                mask: mask,
                onAnimationEnd: () => {
                    this.setState({ hide: true })
                }
            },
            hide: false,//显示
        })
    }
    show(content, duration, mask) {
        return this.notice(content, 'info', duration, function () { }, mask);
    }
    info(content, duration, onClose, mask) {
        return this.notice(content, 'info', duration, onClose, mask);
    }
    success(content, duration, onClose, mask) {
        return this.notice(content, 'success', duration, onClose, mask);
    }
    fail(content, duration, onClose, mask) {
        return this.notice(content, 'fail', duration, onClose, mask);
    }
    offline(content, duration, onClose, mask) {
        return this.notice(content, 'offline', duration, onClose, mask);
    }
    loading(content, duration, onClose, mask) {
        return this.notice(content, 'loading', duration, onClose, mask);
    }
    hide() {
        this.setState({ hide: true })
    }
};

module.exports = YSToast;
