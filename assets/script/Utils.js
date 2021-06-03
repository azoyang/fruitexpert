

function Utils() {
    this.randomArray = function(t,c) {
        if(t.length<c){
            let oldLength=t.length;
            let repairCount=c-oldLength;
            let beishu=Math.floor(repairCount/oldLength);
            if(beishu>0){
                for(let i=0;i<beishu;i++){
                    t.forEach(element => {
                        t.push(element);
                    });
                }
                let limitNum=c-oldLength*beishu;
                if(limitNum>0){
                    for(let i=0;i<limitNum;i++){
                        let randomIndex=Math.floor(t.length*Math.random());
                        t.push(t[randomIndex]);
                    }
                }
            }else{
                for(let i=0;i<repairCount;i++){
                    let randomIndex=Math.floor(t.length*Math.random());
                    t.push(t[randomIndex]);
                }
            }
            

            
        }
        t.sort(function(t, e) {
            return 10 * Math.random() < 5 ? 1 : -1;
        });
        return t.slice(0,c);
    };
    this.arrayRemove=function(array,item){
        let index = array.indexOf(item); 
        if (index > -1) { 
            array=array.splice(index, 1); 
        } 
    };
    this.getPicPath=function(k){
        if(k.length==1){
            return "pic/"+k+k+"/"+k;
        }else{
            return "pic/"+k.substring(0,2) +"/"+k;
        }
        
    },
    this.getVideoPath=function(k){
        return "mp4/"+k;
    },
    this.dispatchCustormEvent=function(eventKey,userData){
        let evt = new cc.Event.EventCustom(eventKey, true);
        evt.setUserData(userData);
        cc.systemEvent.dispatchEvent(evt);
    },
    this.loadPic=function(k,callBack){
        let url=this.getPicPath(k);
        this.load(null,url,null,false,false,callBack);
    },
    this.load=function(parent,url,openParam,showEffect,isTop,callBack){
        console.log("url="+url);
        if (undefined===showEffect) 
            showEffect=false;
        if (undefined===isTop) 
            isTop=false;
        if(url.indexOf('preb/')>-1){
            cc.resources.load(url, (err, res)=>{
                if (err) {
                    cc.log('Error url [' + err + ']');
                    return;
                }else{
                    if(parent){
                        var prefab = cc.instantiate(res);
                        prefab.setPosition(0, 0);
                        
                        //var node = new cc.Node("ParentNode" + prefab.name);
                        //node.setPosition(0, 0);
                        if (undefined!==openParam && null !=openParam){
                            prefab.openParam = openParam;
                            if(undefined!==openParam.pos){
                                prefab.setPosition(openParam.pos.x, openParam.pos.y);
                            }
                        }
                        prefab.openTime = cc.sys.now();
                        //prefab.parent = node;

                        parent.addChild(prefab);
                        if(isTop){
                            this.setTopIndex(prefab);
                        }else{
                            this.setBottomIndex(prefab);
                        }
                        if(showEffect){
                            this.showNodeEffect(prefab);
                        }
                    }
                }
            });
        }else if(url.indexOf('gamelib/')>-1){
            cc.resources.load(url, (err, res)=>{
                if (err) {
                    cc.log('Error url [' + err + ']');
                    return;
                }else{
                    (null != callBack && null != parent) ? callBack.apply(parent, [res.json]) : null != callBack && callBack(res.json);
                }
            });
        }else if(url.indexOf('pic/')>-1){
            cc.resources.load(url, cc.SpriteFrame,(err, res)=>{
                if (err) {
                    cc.log('Error url [' + err + ']',url);
                    return;
                }else{
                    (null != callBack && null != parent) ? callBack.apply(parent, res) : null != callBack && callBack(res);
                }
            });
        }else if(url.indexOf('http://')>-1 || url.indexOf('https://')>-1){
            cc.assetManager.loadRemote(url,  (err, res)=>{
                if (err) {
                    cc.log('Error url [' + err + ']',url);
                    return;
                }else{
                    (null != callBack && null != parent) ? callBack.apply(parent, res) : null != callBack && callBack(res);
                }
            });
        }
    },
    this.openAlertUI=function(parent,data){
        //parent,url,openParam,showEffect,isTop,callBack
        this.load(parent,'preb/AlertUI',data,false,true,null);
    }
    this.close=function(node){
        node.node.destroy();
        node.node.removeFromParent(!0);
    };
    this.closeListNode=function(listNode){
        if(listNode && listNode.length>0){
            for(let i=0;i<listNode.length;i++){
                listNode[i].destroy();
                listNode[i].removeFromParent(!0);
            }
        }
        
    };
    this.setTopIndex = function(node) {
        node && node.parent && node.setSiblingIndex(node.parent.childrenCount - 1);
    };
    this.setBottomIndex = function(node) {
        node && node.parent && node.setSiblingIndex(0);
    };
    this.showNodeEffect = function(node, _index) {
        if (undefined===_index) 
            _index=-1;
        if (null != node) {
            var o = node.getComponent(cc.Animation);
            if (o) {
                var i = o.getClips();
                -1 == _index && (_index = Math.floor(Math.random() * i.length));
                -1 != _index &&
                    i.length > 2 &&
                    i.length % 2 == 0 &&
                    (_index += 2 * Math.floor((Math.random() * i.length) / 2));
                var n = i[_index];
                n && o.play(n.name);
            }
        }
    };
}
exports.Utils = Utils;
exports.utils = new Utils();


function AudioManager() {
    //-----------------------------------------------------------
    this._bgm = -1;//sound Id
    this._bgmCurrent = null; //当前BGM
    this._soundLoads = {};
    this._isSoundOff = false;
    this._isPlaySound = false;
    this._bgmVolume = 1;
    this._lastSound = -1;

    this.playEffect=function(t){
        this.playSound(t, false, !0,null,"effect");
    };
    this._getSoundPath = function(t,type) {
        if(type=='cn' || type=='en' || type=='py' || type=='math'){
            if(type=='math')
                type="cn";
            let tmp=t;
            if(tmp.length==1){
                tmp+=tmp;
            }    
            return "sound/lib/"+type + "/"+ tmp.substring(0,2) +"/"+t;
        }
        else 
            return "sound/"+type+"/"+t;
    };
    this.sound_json = null;
    this.storagePath = "";

    this.setBGMVolume = function(t) {
        this._bgmVolume = t;
        this.updateBGMVolume();
    };
    this.setSoundOff = function(t) {
        this._isSoundOff = t;
        this.updateBGMVolume();
    };
    this.getSoundOff=function(){
        return this._isSoundOff;
    };
    this.updateBGMVolume=function(){
        if(-1 != this._bgm){
            cc.audioEngine.setVolume(this._bgm, this._isPlaySound?0.2:this._bgmVolume);
            cc.audioEngine.setVolume(this._bgm, this._isSoundOff?0:this._bgmVolume);
        }
    },
    //bgmname=背景音乐
    this.playBGM = function(bgmname) {
        if(exports.stringUtil.isBlank(bgmname) && this._bgmCurrent==bgmname)
            return;
        else{
            this.stopBGM();
            var bgmpath = this._getSoundPath(bgmname,"bgm");
            cc.resources.load(bgmpath, cc.AudioClip, null,  (err, clip) =>{
                if (err) {
                    cc.warn('Error '+bgmpath+' [' + err + ']');
                }else{
                    this._bgmCurrent=bgmname;
                    this._bgm = cc.audioEngine.playMusic(clip, true);
                    this.updateBGMVolume();
                }
            });
        }
    };
    this.stopBGM = function() {
        if (this._bgm >= 0) {
            cc.audioEngine.stop(this._bgm);
            this._bgm = -1;
            this._bgmCurrent=null;
        }
    };
    this.isPlayLastSound = function() {
        return -1 != this._lastSound;
    };
    this.playSounds=function(soundList,type){
        if(undefined!==soundList && soundList.length>0){
            let currentSoundIndex=0;
            var r = this._getSoundPath(soundList[currentSoundIndex],type);
            cc.resources.load(r, cc.AudioClip, null,  (err, clip) =>{
                if (err) {
                    cc.warn('Error '+r+' [' + err + ']');
                }else{
                    this._lastSound = cc.audioEngine.play(clip, false, this._bgmVolume);
                    console.log("play=>"+name+",id=>"+this._lastSound);
                    cc.audioEngine.setFinishCallback(this._lastSound,()=>{
                        cc.sys.isBrowser || cc.audioEngine.uncache(r);
                        this._lastSound=-1;
                        this._isPlaySound=false;
                        this.updateBGMVolume();
                        if(null!=callBack){
                            callBack();
                        }
                    });
                }
            });
        }
    };
    this.playSound = function(name, isStopPre, isReduceBGM, callBack,type) {
        if (!exports.stringUtil.isBlank(name)) {
            if(isReduceBGM){
                
                this.updateBGMVolume();
            }
            if (isStopPre) {
                this._isPlaySound=true;
                this.stopLastSound();
                //cc.audioEngine.stop(this._lastSound);
            }
            var r = this._getSoundPath(name,type);
            cc.resources.load(r, cc.AudioClip, null,  (err, clip) =>{
                if (err) {
                    cc.warn('Error '+r+' [' + err + ']');
                }else{
                    let currentSoundId=cc.audioEngine.play(clip, false, this._bgmVolume);
                    if(isStopPre){
                        this._lastSound = currentSoundId;
                    }
                    //console.log("play=>"+name+",id=>"+this._lastSound);
                    cc.audioEngine.setFinishCallback(currentSoundId,()=>{
                        cc.sys.isBrowser || cc.audioEngine.uncache(r);
                        if(isStopPre){
                            this._lastSound=-1;
                            this._isPlaySound=false;
                        }
                        this.updateBGMVolume();
                        if(null!=callBack){
                            callBack();
                        }
                    });
                }
            });

        }
    };

    this.stopLastSound = function () {
        if(-1 != this._lastSound) {
            console.log("stop=>"+this._lastSound);
            cc.audioEngine.stop(this._lastSound);
        }
    };
    this.playClickSound = function() {
        this._isSoundOff ||
            cc.audioEngine.play(
                this._getSoundPath(config.Config.clickBtnSound),
                !1,
                this._bgmVolume
            );
    };
    this.getStoragePath = function() {
        "" == this.storagePath &&
            (this.storagePath =
                (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") +
                "update-assets");
        return this.storagePath;
    };
    this.isExitManifest = function() {
        return null != this.sound_json;
    };

    this.loadMainifest = function() {
        if (!cc.sys.isBrowser)
            if (null == this.sound_json) {
                console.log("开始下载语音")
                this.storagePath =
                    (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") +
                    "update-assets";
                var t =
                        this.storagePath +
                        "/res/raw-assets/resources/" +
                        config.Config.skin +
                        "/res/sound.json",
                    e = this;
                if (jsb.fileUtils.isFileExist(t))
                    cc.loader.load(t, function(t, i) {
                        if (null == t) {
                            e.sound_json = i;
                            console.log("e.sound_json is "+e.sound_json);
                            facade.send("LOAD_MANIFEST_OVER", null, !0);
                        } else exports.alertUtil.alert(t.toString());
                    });
                else {
                    t = config.Config.skin + "/res/sound";
                    cc.loader.loadRes(t, function(t, i) {
                        if (null == t) {
                            e.sound_json = i;
                            console.log("e.sound_json is "+e.sound_json);
                            facade.send("LOAD_MANIFEST_OVER", null, !0);
                        } else exports.alertUtil.alert(t.toString());
                    });
                }
            } else facade.send("LOAD_MANIFEST_OVER");
    };
    this.isNeedDown = function() {
        if (cc.sys.isBrowser) return !1;
        if ("1" == cc.sys.localStorage.getItem("DOWN_SOUND")) return !0;
        if (
            jsb.fileUtils.isDirectoryExist(
                cc.url.raw("resources/" + config.Config.skin + "/res/audio_down/")
            )
        )
            return !1;
        this.storagePath =
            (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") +
            "update-assets";
        return !jsb.fileUtils.isDirectoryExist(
            this.storagePath +
                "/res/raw-assets/resources/" +
                config.Config.skin +
                "/res/audio_down/"
        );
    };
    this.isNeedDownType = function(t, e) {
        if (cc.sys.isBrowser) return !1;
        if (null == this.sound_json) {
            this.loadMainifest();
            return !1;
        }
        var o = this.getLoadItems(t, e);
        return o && o.length > 0;
    };
    
    this.getLoadItems = function(t, e) {
        var o = localcache.getList(localdb.table_voiceDown),
            n = [];
        if (cc.sys.isBrowser) return null;
        cc.log(t, e);
        var l = jsb.fileUtils.isDirectoryExist(
            cc.url.raw("resources/" + config.Config.skin + "/res/audio_down/")
        );
        if (0 == t)
            for (var r in this.sound_json.assets) {
                var a = this.storagePath + "/" + r,
                    s = this.sound_json.assets[r],
                    c = r.replace("res/raw-assets/", ""),
                    _ = cc.url.raw(c);
                jsb.fileUtils.isFileExist(a) ||
                    null == s ||
                    (l && jsb.fileUtils.isFileExist(_)) ||
                    n.push({
                        key: r,
                        item: s
                    });
            }
        else
            for (var d = 0; d < o.length; d++)
                if (o[d].type == t && e == o[d].para) {
                    (r =
                        "res/raw-assets/resources/" +
                        config.Config.skin +
                        "/res/audio_down/" +
                        o[d].id +
                        ".mp3"),
                        (a = this.storagePath + "/" + r),
                        (_ = cc.url.raw(
                            "resources/" +
                                config.Config.skin +
                                "/res/audio_down/" +
                                o[d].id +
                                ".mp3"
                        )),
                        (s = this.sound_json.assets[r]);
                    jsb.fileUtils.isFileExist(a) ||
                        null == s ||
                        (l && jsb.fileUtils.isFileExist(_)) ||
                        n.push({
                            key: r,
                            item: s
                        });
                }
        return n;
    };
}

exports.AudioManager = AudioManager;
exports.audioManager = new AudioManager();


function StringUtil() {

    this.isMobile=function(num){
        return /^((13[0-9])|(14[5,7,9])|(15[0-3,5-9])|(166)|(17[3,5,6,7,8])|(18[0-9])|(19[8,9]))\d{8}$/.test(num) || /^(5|6|8|9)\\d{7}$/.test(num)
    };

    this.trim = function(t) {
        return t.replace(/(^\s*)|(\s*$)/g, "");
    };
    this.isBlank = function(t) {
        return (
            null == t ||
            "" == t ||
            " " == t ||
            //"0" == t ||
            "null" == t ||
            "undefined" == t
        );
    };
    this.hasLimit = function(t) {
        for (
            var e = ["|", "#", "<", ">", "%", "*", "/", "\\", "="],
                o = 0,
                i = e.length;
            o < i;
            o++
        )
            if (t.indexOf(e[o]) >= 0) return !0;
        return !1;
    };
    this.hasBlank = function(t) {
        for (
            var e = ["\n", "\r", "\t", "\f", " ", "　"], o = 0, i = e.length;
            o < i;
            o++
        )
            if (t.indexOf(e[o]) >= 0) return !0;
        return !1;
    };
    this.hasEmoji = function(t) {
        return t.indexOf("\ud83c") >= 0 || t.indexOf("\ud83d") >= 0;
    };

}

exports.StringUtil = StringUtil;
exports.stringUtil = new StringUtil();



function TimeUtil() {
    // this._timezoneServer = 8;
    // this._timezoneClient = 8;
    // this._timezoneOffset = 0;
    // this._timeServer = 0;
    // this._timeClient = 0;
    // this._timeOfMonday = 0;
    this.perDayMicoSeconds=86400000;

    // this.init = function(t, e) {
    //     this.setServerTime(e);
    //     this._timezoneServer = t;
    //     this._timezoneClient = -new Date().getTimezoneOffset() / 60;
    //     this._timezoneOffset =
    //         36e5 * (this._timezoneClient - this._timezoneServer);
    //     this._timeOfMonday = this.timeAtHMS(Date.UTC(2015, 11, 28) / 1e3);
    // };
    // this.setServerTime = function(t) {
    //     this._timeServer = t;
    //     this._timeClient = Math.floor(cc.sys.now() / 1e3);
    // };
    // Object.defineProperty(TimeUtil.prototype, "second", {
    //     get: function() {
    //         return (
    //             this._timeServer +
    //             Math.floor(cc.sys.now() / 1e3) -
    //             this._timeClient
    //         );
    //     },
    //     enumerable: !0,
    //     configurable: !0
    // });
    // this.getCurSceond = function() {
    //     return (
    //         this._timeServer + Math.floor(cc.sys.now() / 1e3) - this._timeClient
    //     );
    // };
    // this.getTodaySecond = function(t, e, o) {
    //     void 0 === t && (t = 0);
    //     void 0 === e && (e = 0);
    //     void 0 === o && (o = 0);
    //     null == t && (t = 0);
    //     null == e && (e = 0);
    //     null == o && (o = 0);
    //     return this.timeAtHMS(this.second, t, e, o);
    // };
    // this.timeAtHMS = function(t, e, o, i) {
    //     e = e || 0;
    //     o = o || 0;
    //     i = i || 0;
    //     var n = t % 86400,
    //         l = t - n,
    //         r = Math.floor(n / 3600);
    //     r + this._timezoneServer < 0
    //         ? (l -= 86400)
    //         : r + this._timezoneServer >= 24 && (l += 86400);
    //     return l + 3600 * (e - this._timezoneServer) + 60 * o + i;
    // };
    // this.isSameWeek = function(t, e) {
    //     return (
    //         !(t - e >= 604800) &&
    //         (t - this._timeOfMonday) / 604800 ==
    //             (e - this._timeOfMonday) / 604800
    //     );
    // };
    // this.hms2second = function(t) {
    //     var e = t.split(":"),
    //         o = e.length,
    //         i = 0;
    //     o > 0 && (i += 3600 * parseInt(e[0]));
    //     o > 1 && (i += 60 * parseInt(e[1]));
    //     o > 2 && (i += parseInt(e[2]));
    //     return i;
    // };
    // this.second2hms = function(t, e) {
    //     if (t > 86400 && null == e) {
    //         var o = t % 86400;
    //         o = Math.floor(o / 3600);
    //         return (
    //             i18n.t("COMMON_DAY", {
    //                 d: Math.floor(t / 86400)
    //             }) +
    //             (o > 0
    //                 ? i18n.t("COMMON_HOUR", {
    //                       d: o
    //                   })
    //                 : "")
    //         );
    //     }
    //     var i = Math.floor(t / 3600),
    //         n = Math.floor((t - 3600 * i) / 60),
    //         l = t % 60,
    //         r = e || "HH:mm:ss";
    //     "HH:mm" == r && t < 60 && (r = "ss");
    //     return (
    //         (r = (r = (r = r.replace("HH", this.fix2(i))).replace(
    //             "mm",
    //             this.fix2(n)
    //         )).replace("ss", this.fix2(l))) + ("ss" == r ? "s" : "")
    //     );
    // };
    // this.str2Second = function(t) {
    //     var e = t.split(" "),
    //         o = e[0].split("-"),
    //         i = e[1].split(":");
    //     return (
    //         (new Date(
    //             Math.floor(parseInt(o[0])),
    //             Math.floor(parseInt(o[1])) - 1,
    //             Math.floor(parseInt(o[2])),
    //             Math.floor(parseInt(i[0])),
    //             Math.floor(parseInt(i[1])),
    //             Math.floor(parseInt(i[2]))
    //         ).getTime() +
    //             this._timezoneOffset) /
    //         1e3
    //     );
    // };
    // this.format = function(t, e) {
    //     var o = new Date();
    //     o.setTime(1e3 * t - this._timezoneOffset);
    //     var i = e || "yyyy-MM-dd HH:mm:ss";
    //     return (i = (i = (i = (i = (i = (i = i.replace(
    //         "yyyy",
    //         o.getFullYear() + ""
    //     )).replace("MM", this.fix2(o.getMonth() + 1))).replace(
    //         "dd",
    //         this.fix2(o.getDate())
    //     )).replace("HH", this.fix2(o.getHours()))).replace(
    //         "mm",
    //         this.fix2(o.getMinutes())
    //     )).replace("ss", this.fix2(o.getSeconds())));
    // };
    this.fix2 = function(t) {
        return t < 10 ? "0" + t : "" + t;
    };
    // this.getCurMonth = function() {
    //     var t = new Date();
    //     t.setTime(1e3 * this.second );
    //     var e = this.fix2(t.getMonth() + 1);
    //     return parseInt(e);
    // };
    this.getCurDateArray = function(newValue) {
        var date =null;
        if(undefined!==newValue){
            date = new Date(newValue.replace(/-/g, "/"));
        }else{
            date = new Date();
        }
        return [date.getFullYear(),date.getMonth()+ 1,date.getDate(),date.getDay()];
    };
    this.str2date=function(dateStr){
        var date =null;
        if(undefined!==dateStr && dateStr){
            date = new Date(dateStr.replace(/-/g, "/"));
        }else{
            date = new Date();
        }
        return date;
    };
    this.formatArray2Str=function(year,month,day){
        return year+"-"+this.fix2(month)+"-"+this.fix2(day);
    };
    /**
     * 时间戳转日期
     * @param timeStamp
     * @returns {string}
     */
    this.timeStamp2strDate=function (timeStamp) {
        let d = new Date(timeStamp);    //根据时间戳生成的时间对象
        return d;
    };
    this.getDay=function(date,num){
        // let today = new Date(date.replace(/-/g, "/"));
        let today = date;
        let nowTime = today.getTime();
        let ms = this.perDayMicoSeconds*num;
        today.setTime(parseInt(nowTime + ms));
        let oYear = today.getFullYear();
        let oMoth = (today.getMonth() + 1).toString();
        if (oMoth.length <= 1) oMoth = '0' + oMoth;
        let oDay = today.getDate().toString();
        if (oDay.length <= 1) oDay = '0' + oDay;
        return oYear + separator + oMoth + separator + oDay;
    };

    this.getYearBegin=function(date){
        let d=new Date(date.getTime());
        d.setDate(1);
        d.setMonth(0);
        this.setDayBegin(d);
        return d;
    };
    this.setDayBegin=function(date){
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);
    };
    /**
     * 是指定日期的第几天,前几天
    */
    this.getDateDiff=function(date1,date2){
        this.setDayBegin(date1);
        this.setDayBegin(date2);
        var stime =date1.getTime();
        var etime = date2.getTime();
        var usedTime = etime - stime;  //两个时间戳相差的毫秒数
        var days=Math.floor(usedTime/this.perDayMicoSeconds);
        if(days>=0)
            days+=1;
        //计算出小时数
        // var leave1=usedTime%this.perDayMicoSeconds;    //计算天数后剩余的毫秒数
        // if(usedTime>0 && leave1>0){
        //     days+=1;
        // }
        //var hours=Math.floor(leave1/(3600*1000));
        //计算相差分钟数
        //var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        //var minutes=Math.floor(leave2/(60*1000));
        // var time = days + "天"+hours+"时"+minutes+"分";
        //var time = days;
        return days;
    };
    // this.getCurData = function() {
    //     var t = (this.second - this._timeOfMonday) % 604800;
    //     return Math.floor(t / 86400) + 1;
    // };
    // this.getDateDiff = function(t) {
    //     var e = this.second - t;
    //     return e < 0 || e < 60
    //         ? i18n.t("TIME_MOMENT_AGO")
    //         : e < 3600
    //         ? i18n.t("TIME_SECOND_AGO", {
    //               s: Math.floor(e / 60)
    //           })
    //         : e < 86400
    //         ? i18n.t("TIME_HOUR_AGO", {
    //               s: Math.floor(e / 3600)
    //           })
    //         : e < 2592e3
    //         ? i18n.t("TIME_DAY_AGO", {
    //               s: Math.floor(e / 86400)
    //           })
    //         : i18n.t("TIME_MONTH_AGO", {
    //               s: Math.floor(e / 2592e3)
    //           });
    // };
    /**
     * 返回这个月第一天是礼拜几和这个月有几天
    */
    this.getTimeDataFun=function(year, month){
        let temp = new Date(year, month, 0);
        let max = temp.getDate()
        temp.setDate(1)
        let min = temp.getDay()
        let bol = this.isLeapYear(year);//(year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        if (month == 2) {
            max = bol?29:28;
        }
        return { firstDayWeekNum: min, maxDay: max };
    };
    /**
         * 判断某一年是否是闰年
         * @param year
         * @returns {boolean}
         */
    this.isLeapYear=function (year) {
        return((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
    };
    
    /**
     * 返回这个日期是今年的第几天
    */
   this.getYearDay=function(newValue){
        var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        // var date = new Date(newValue.replace(/-/g, "/"));
        var date = newValue;
        var day = date.getDate();
        var month = date.getMonth(); //getMonth()是从0开始
        var year = date.getFullYear();
        var result = 0;
        for ( var i = 0; i < month; i++) {
            result += dateArr[i];
        }
        result += day;
        //判断是否闰年
        if (month > 1 && this.isLeapYear(year)) {
            result += 1;
        }
        return result;
    };
    this.getAge=function(micoseconds){
        var birth= new Date(micoseconds);
        var yearBirth = birth.getFullYear();
        var monthBirth = birth.getMonth() + 1;
        var dayBirth = birth.getDate();

        var date = new Date();
        var yearNow = date.getFullYear();
        var monthNow = date.getMonth() + 1;
        var dayNow = date.getDate();
        var largeMonths = [1,3,5,7,8,10,12], //大月， 用于计算天，只在年月都为零时，天数有效
            lastMonth = monthNow -1>0?monthNow-1:12,  // 上一个月的月份
            daysOFMonth = 0;    // 当前日期的上一个月多少天

        if(largeMonths.indexOf(lastMonth)>-1){
            daysOFMonth = 31;
        }else if(lastMonth===2){
            if(this.isLeapYear(yearNow)){
                daysOFMonth = 29;
            }else{
                daysOFMonth = 28;
            }
        }else{
            daysOFMonth = 30;
        }

        var Y = yearNow - yearBirth;
        var M = monthNow - monthBirth;
        var D = dayNow - dayBirth;
        if(D < 0){
            D = D + daysOFMonth; //借一个月
            M--;
        }
        if(M < 0){  // 借一年 12个月
            Y--;
            M = M + 12; //
        }
        let returnStr="";
        if(Y>0){
            returnStr+=Y+"岁";
        }
        if(M>0){
            returnStr+=M+"个月";
        }
        // if(D>0){
        //     returnStr+=D+"天";
        // }
        return returnStr;
    }
};

    


exports.TimeUtil = TimeUtil;
exports.timeUtil = new TimeUtil();



function Alert() {
    this.isPlaying = false;
    this.alertPrefabmap = {};
    this.alertList = new Array();

    this.alertText = function(text, textColor) {
        if(undefined!==text && null!=text && text.length>0){
            this.alertBy("TipsUI", {
                text: text,
                textColor: textColor
            });
        }
        
    };

    this.alertBy = function(uiName, alertContent) {
        if (null != this.alertPrefabmap[uiName]) 
            this.alertShow(uiName, alertContent);
        else {
            let url="preb/"+uiName;
            cc.resources.load(url, (err, res)=>{
                if(err){
                    cc.log('Error url [' + err + ']');
                }else{
                    this.alertPrefabmap[uiName] = res;
                    this.alertShow(uiName, alertContent);
                }
            });
        }
    };
    this.alertShow = function(uiName, alertContent) {
        var preb = cc.instantiate(this.alertPrefabmap[uiName]);
        if (preb) {
            preb.y = 100;
            preb.x = 0;
            var jsComponent = preb.getComponent(uiName);
            for (var key in alertContent) 
                jsComponent[key] = alertContent[key];

            this.alertAddToQueueOneByOne(preb, jsComponent);
        } else cc.warn("alert show " + t + " is error!!!");
    };
    
        //逐个展现消失t, e
    this.alertAddToQueueOneByOne = function(preb, jsComponent) {
        jsComponent.endCall = ()=> {
            this.alertList.splice(this.alertList.indexOf(jsComponent), 1);
        };
        this.alertList.push(jsComponent);
        let indexList=this.alertList.indexOf(jsComponent);

        let anim= preb.getComponent(cc.Animation);
        let animState = anim.play();
        //animState.speed=3;
        cc.tween(preb)
        .delay(indexList*0.5)
        .call(() => {
            cc.director.getScene().getChildByName("Canvas").addChild(preb);
        })
        .to(3, { position:new cc.Vec2(0, preb.y+300)})
        .call(() => {
            this.alertList.splice(this.alertList.indexOf(jsComponent), 1);
            cc.director.getScene().getChildByName("Canvas").removeChild(preb);
        })
        .start();

    };
}

exports.Alert = Alert;
exports.alertUtil = new Alert();