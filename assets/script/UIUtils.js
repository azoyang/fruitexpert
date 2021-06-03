function UIUtils() {
    //震动效果
    this.shakeArr = [[1, 1], [-1, -1], [-1, 1], [1, -1]];
    //倒计时进度条


    //倒计时显示文字
        this.countDown = function(seconds/** 总秒数*/, 
            label/** 显示倒计时的label*/, 
            callBack/** 时间到了的回调函数*/) {
            let repeatCount=seconds+1;
            if (null != seconds && 0 != seconds) {
                label.unscheduleAllCallbacks();
                label.schedule(()=>{
                    repeatCount--;
                    if(repeatCount>=0){
                        label.string=repeatCount;
                    }else{
                        callBack && callBack();
                        label.unscheduleAllCallbacks();
                    }
                }, 1);
            }
        };
        this.scaleRepeat = function(t, e, o, i) {
            void 0 === e && (e = 0.8);
            void 0 === o && (o = 1.2);
            void 0 === i && (i = 1);
            if (null != t) {
                var n = t.scaleX,
                    l = t.scaleY;
                t.scaleX = n * e;
                t.scaleY = l * e;
                t.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.scaleTo(i, n * o, l * o),
                            cc.scaleTo(i, n * e, l * e)
                        )
                    )
                );
            }
        };
        this.fadeRepeat = function(t, e, o, i) {
            void 0 === e && (e = 0);
            void 0 === o && (o = 255);
            void 0 === i && (i = 1);
            if (null != t) {
                t.opacity = e;
                t.runAction(
                    cc.repeatForever(
                        cc.sequence(cc.fadeTo(i, o), cc.fadeTo(i, e))
                    )
                );
            }
        };
        this.fadeOver = function(t, e, o) {
            void 0 === e && (e = 0);
            void 0 === o && (o = 1);
            null != t && t.runAction(cc.fadeTo(o, e));
        };
        this.showText = function (label, des, interval, handler) {
            if (interval === void 0) { interval = 0.1; }
            if (label == null || des == "" || des.length == 0)
                return;
            if (des.length == 1) {
                label.unscheduleAllCallbacks();
                label["isRunShowText"] = false;
                if (handler) {
                    handler();
                }
                label.string = des;
                return;
            }
            label.string = "";
            label.unscheduleAllCallbacks();
            label["isRunShowText"] = true;
            label["context"] = des;
            label.schedule(cb, interval);
            function cb() {
                var length = label.string ? label.string.length : 0;
                if (length < des.length) {
                    var txt = des.substring(length);
                    var txt2 = txt.substring(0,1);
                    if (txt2 == "<") {
                        length = length + txt.indexOf(">");
                        txt = des.substring(length+1);
                        length = length + txt.indexOf(">");
                    }
                    label.string = des.substring(0, length + 1);
                }
                else {
                    label.unscheduleAllCallbacks();
                    label["isRunShowText"] = false;
                    if (handler) {
                        handler();
                    }
                }
            }
            cb();
        };
        this.showNumChange = function(t, e, o, n, l, r, a, s) {
            void 0 === n && (n = 30);
            void 0 === s && (s = !0);
            if (null != t)
                if (e != o) {
                    t.numIndex = 1;
                    t.unscheduleAllCallbacks();
                    t.schedule(c, 0.04);
                    c();
                } else {
                    t.numIndex = n;
                    c();
                }
            function c() {
                var c = t.numIndex++,
                    _ = e + Math.floor(((o - e) / n) * c);
                _ = c >= n ? o : _;
                var d = s ? utils.utils.formatMoney(_) : _ + "";
                if (l)
                    if (r) {
                        var u = {};
                        u[r] = d;
                        d = i18n.t(l, u);
                    } else d = i18n.t(l) + " " + d;
                t.string = d;
                if (c >= n) {
                    t.unscheduleAllCallbacks();
                    a && a();
                }
            }
        };
        //n.uiUtils.showPrgChange(this.prg, this.prg.progress, 0 == s ? 0 : s, 1, 5,
        //function() {
        //    c.prg.progress = s;
        //});
        this.showProgressBarChange=function(barNode,fromRate,toRate,needSeconds,callBack,callBackParam){
            //barNode.totalLength
            let step=(toRate-fromRate)/(needSeconds/0.04);
            barNode.progress=fromRate;
            barNode.schedule(()=>{
                if(barNode.progress+step<toRate){
                    barNode.progress=toRate;
                }else{
                    barNode.progress+=step;
                }
                if(barNode.progress<=toRate){
                    barNode.unscheduleAllCallbacks();
                    if(undefined!==callBack){
                        if(undefined!==callBackParam){
                            callBack(callBackParam);
                        }else{
                            callBack();
                        }
                    }
                    
                }
            }, 0.04);
        };
        this.showPrgChange = function(t/** 进度条的node */, 
            e/** 进度条的bar */, o/** 百分比 */, i, n, l/** 回掉函数 */) {
            void 0 === e && (e = 0);
            void 0 === o && (o = 1);
            void 0 === i && (i = 1);
            void 0 === n && (n = 30);
            if (null != t) {
                n = n;
                i = i;
                e = e;
                o = null != o ? o : 1;
                t.progress = e;
                if (e != o) {
                    t.numIndex = 1;
                    t.unscheduleAllCallbacks();
                    t.schedule(r, 0.04);
                    r();
                }
            }
            function r() {
                var r = t.numIndex++,
                    a = e + ((o - e) / n) * ((r % n) + 1);
                a = (a = a < 0.05 ? 0 : a) > 1 ? 1 : a;
                t.progress = a;
                if (r + 1 >= n * i) {
                    t.unscheduleAllCallbacks();
                    l && l();
                }
            }
        };
        this.getRwd = function(t) {
            for (
                var e = new Array(), o = t.split(","), i = 0;
                i < o.length;
                i++
            ) {
                var n = o[i].split("|"),
                    l = new s();
                l.id = n.length > 0 ? parseInt(n[0]) : 0;
                l.count = n.length > 1 ? parseInt(n[1]) : 0;
                l.kind = n.length > 2 ? parseInt(n[2]) : 0;
                e.push(l);
            }
            return e;
        };
        this.getRwdItem = function(t) {
            for (var e = new Array(), o = {}, i = 0; t && i < t.length; i++) {
                var n = t[i].itemid;
                if (1 != o[n]) {
                    o[n] = 1;
                    e.push({
                        id: n
                    });
                }
            }
            return e;
        };
        this.getItemNameCount = function(t, e) {
            var o = localcache.getItem(localdb.table_item, t);
            return i18n.t("COMMON_ADD", {
                n: o ? o.name : "",
                c: e
            });
        };
        this.moveNodeAction = function(sp,endPos,time,cb){
            //起点
            let sp_x = sp.getPosition().x;
            let sp_y = sp.getPosition().y;
            //终点
            let node_x = endPos.x;
            let node_y = endPos.y;
            //曲线幅度
            let x_add = 50;//x_add_random;
            let y_add = 10;//y_add_random;
            let centre_x = node_x + (sp_x - node_x)/2 + x_add;
            let centre_y = node_y + (sp_y - node_y)/2 + y_add;

            let bezierArray = [];
            bezierArray.push(new cc.Vec2(sp_x,sp_y));
            bezierArray.push(new cc.Vec2(centre_x,centre_y));
            bezierArray.push(new cc.Vec2(node_x,node_y));
            let bezier = cc.bezierTo(time,bezierArray)
            let func = cc.callFunc(()=>{
                cb && cb();
            });
            let seq = cc.sequence(bezier,func)
            sp.runAction(seq)
        }
        this.showShake = function(t, e, o, i) {
            void 0 === e && (e = 4);
            void 0 === o && (o = 12);
            if (null != t) {
                var n = this;
                if (t.orgx) {
                    t.node.x = t.orgx;
                    t.node.y = t.orgy;
                } else {
                    t.orgx = t.node.x;
                    t.orgy = t.node.y;
                }
                t.numIndex = 1;
                t.unscheduleAllCallbacks();
                t.schedule(l, 0.04);
                l();
            }
            function l() {
                var l = t.numIndex++,
                    r = (o - l) / o,
                    a = l % 4;
                t.node.x = n.shakeArr[a][0] * r * e + t.orgx;
                t.node.y = n.shakeArr[a][1] * r * e + t.orgy;
                if (l >= o) {
                    t.node.x = t.orgx;
                    t.node.y = t.orgy;
                    t.unscheduleAllCallbacks();
                    i && i();
                }
            }
        };
        this.showShakeNode = function(t, e, o, i) {
            void 0 === e && (e = 4);
            void 0 === o && (o = 12);
            if (null != t) {
                var n = t.getComponent(cc.Component);
                n && this.showShake(n, e, o, i);
            }
        };
        this.floatPos = function(t, e, o, i) {
            void 0 === e && (e = 0);
            void 0 === o && (o = 0);
            void 0 === i && (i = 1);
            if (null != t) {
                if (t.orgx) {
                    t.x = t.orgx;
                    t.y = t.orgy;
                } else {
                    t.orgx = t.x;
                    t.orgy = t.y;
                }
                t.x = t.orgx + e;
                t.y = t.orgy + o;
                t.runAction(
                    cc.repeatForever(
                        cc.sequence(
                            cc.moveTo(i, t.orgx - e, t.orgy - o),
                            cc.moveTo(i, t.orgx + e, t.orgy + o)
                        )
                    )
                );
            }
        };

        /**
        *数字格式化成两位  主要用于倒计时
        *@param t
        */
        this.changeTwoDigits = function(t){
            return t >= 10 ? (t + "") : "0" + t
        };

        /**
        *秒转化成时分秒
        *@param t 秒数
        */
        this.getCountDownStr = function (t) {
            if (t == null) return "00:00";
            let hour = Math.floor(t/3600);
            let minute = Math.floor((t- hour * 3600)/60);
            let sec = Math.floor(t - hour * 3600 - minute * 60);
            if (t >= 3600){
                return this.changeTwoDigits(hour) + ":" + this.changeTwoDigits(minute);
            }
            else{
                return this.changeTwoDigits(minute) + ":" + this.changeTwoDigits(sec);
            }
        };

        this.getPosDistance = function(src,dst){
            return Math.sqrt((dst.x - src.x)^2 + (dst.y - src.y)^2)
        }
    }
exports.UIUtils = UIUtils;
exports.uiUtils = new UIUtils();
