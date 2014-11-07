javascript:(function() {
    function getVideoFormat(url) {
        var re = /&type=([^;&]+)/;
        return url.match(re)[1];
    }
 
    function getFmtList(args) {
        return args['fmt_list'].split(/,/);
    }

    function getResFmtList(fmt_list) {
        var res = [];
        for (var i=0; i<fmt_list.length; i++) {
            res[i] = fmt_list[i].split(/\//)[1];
        }
        return res;
    }

    function getRes(urls) {
        var res = [];
        for (var i=0; i<urls.length; i++) {
            res[i] = urls[i].match(/[?&]size=([^&]+)/);
            res[i] = (res[i]) ? res[i][1] : '';
        }
        return res;
    }

    function getVideoURLs(stream_map) {
        stream_map = stream_map.replace(/\\\\u0026/, '&');
        var vid_urls = stream_map.split(/,/);
 
        var tmp_url;
 
        for (var i=0; i<vid_urls.length; i++) {
            if (vid_urls[i].search(/^url=/) == 0) {
                vid_urls[i] = vid_urls[i].replace(/^url=/, '');
            } else {
                tmp_url = vid_urls[i].match(/&url=([^&]+)/)[1];
                vid_urls[i] = vid_urls[i].replace(/&url=([^&]+)/, '');
                vid_urls[i] = tmp_url + '&' + vid_urls[i];
            }
 
            vid_urls[i] = decodeURIComponent(vid_urls[i]);
            var p = [/(itag=[^&]+)&?/, /(clen=[^&]+)&?/, /(lmt=[^&]+)&?/];
            for (var k=0; k<p.length; k++) {
                vid_urls[i] = replaceAll(vid_urls[i], p[k]);
            }

            if (vid_urls[i].search(/(\?|&)signature=/) === -1) {return null;}
        }

        return vid_urls;
    }

    function replaceAll(url, p) {
        m = url.match(p);
        if (m) { url = url.replace(new RegExp(p.source, 'g'), '') + '&' + m[1]; }
        return url;
    }
    
    function validate(str) {
        str = str.replace(/[#%&{}\\<>\*\?$!\'":@+`\|=]/g, '');
        str = ltrim(str);
 
        var length = str.length;
 
        str = rtrim(str);
        str = str.replace(/\s|\//g, '_');
 
        return str;
    }
 
    function ltrim(str) {
        return str.replace(/^\s+/, '');
    }
 
    function rtrim(str) {
        return str.replace(/\s+$/, '');
    }
 
    function displayWindow(vid_urls, res, title) {
        var newText = '<h1>' + title + '<\/h1><table><tr><th>&nbsp;<\/th><th>Resolution<\/th><th>Type<\/th><th>Link<\/th><\/tr>';

        for (var r=0; r<vid_urls.length; r++) {
            for (var c=0; c<vid_urls[r].length; c++) {
                newText += '<tr><td>' + (c+1) + '.<\/td><td>' + res[r][c] + '<\/td><td>' + getVideoFormat(vid_urls[r][c]) + '<\/td><td><a target=\'_blank\' href=\'' + vid_urls[r][c] + '&title=' + encodeURIComponent(validate(title)) + '\'>Download<\/a><\/td><\/tr>';
            }
            newText += '<tr><td>&nbsp;</td></tr>';
        }
 
        var newWin = window.open('', 'yt');
        newWin.document.write(newText+'<\/table>');
    }
 
    var args = null;
    try {
        args = ytplayer.config.args;
    } catch (e) {
        alert('Sorry, an error occured. Make sure that you are currently viewing a youtube.com webpage that contains a streamming video before using this bookmarklet. But if you already done that maybe Youtube changes its webpage again. And I need to update this bookmarklet to work again.');
    } finally {
        if (args) {
            var maps = ['url_encoded_fmt_stream_map', 'adaptive_fmts'],
                video_urls = [], res = [], supported = true;

            for (var i=0; i<maps.length; i++) {
                video_urls[i] = getVideoURLs(args[maps[i]]);

                if (video_urls[i] == null) {
                    supported = false;
                    break;
                }

                if (maps[i] == maps[0]) {
                    res[i] = getResFmtList(getFmtList(args));
                } else {
                    res[i] = getRes(video_urls[i]);
                }
            }

            if (supported) {
                displayWindow(video_urls, res, args.title);
            } else {alert("Sorry but this video is not supported by this script!");}
        }
    }
})();