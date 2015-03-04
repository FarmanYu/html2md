var pinyin = require("pinyin");
var _ = {};
module.exports = _;

_.merge = function(source, target){
    if(_.is(source, 'Object') && _.is(target, 'Object')){
        _.map(target, function(key, value){
            source[key] = _.merge(source[key], value);
        });
    } else {
        source = target;
    }
    return source;
};

_.now = function(withoutMilliseconds){
    var d = new Date(), str;
    str = [
        d.getHours(),
        d.getMinutes(),
        d.getSeconds()
    ].join(':').replace(/\b\d\b/g, '0$&');
    if(!withoutMilliseconds){
        str += '.' + ('00' + d.getMilliseconds()).substr(-4);
    }
    return str;
};

_.is = function(source, type){
    return toString.call(source) === '[object ' + type + ']';
};

_.map = function(obj, callback, merge){
    var index = 0;
    for(var key in obj){
        if(obj.hasOwnProperty(key)){
            if(merge){
                callback[key] = obj[key];
            } else if(callback(key, obj[key], index++)) {
                break;
            }
        }
    }
};

_.escapeReg = function(str){
    return str.replace(/[\.\\\+\*\?\[\^\]\$\(\){}=!<>\|:\/，。“”]/g, '-');
}

_.log = function(msg){
	process.stdout.write(_.now(true) + " [NOTIC] " + msg  + "\n");
}
_.error = function(msg){
    process.stdout.write(_.now(true) + " [ERROR] " + msg  + "\n");
}

_.getDate = function(){
    var d = new Date();
    var dateStr = [
            d.getFullYear() , 
            d.getMonth()+1, 
            d.getDate()
        ].join("-").replace(/\b\d\b/g, '0$&');
    return dateStr;
}

_.getPinYin = function(word){
    return pinyin(word, {
        style: pinyin.STYLE_NORMAL
    });
}