javascript:(function() {
    function getVideoFormat(url) {
        var re = /&type=([^;&]+)/;
        var format = url.match(re)[1];
        var dashIndex = format.indexOf('-');

        if (dashIndex != -1) return format.substring(dashIndex+1);
        return format;
    }

    function getSize(url) {
        var size = url.match(/&size=([^&]+)/);
        return (size) ? size[1] : '';
    }
 
    function getVideoURLs(args) {
        var stream_map = args['adaptive_fmts'];
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
            vid_urls[i] = vid_urls[i].replace(/&itag=(\d+)/, '');
            vid_urls[i] = vid_urls[i].replace(/&clen=(\d+)/, '');
            vid_urls[i] = vid_urls[i].replace(/&lmt=(\d+)/, '');

            if (vid_urls[i].search(/&signature=/) === -1) {
                vid_urls[i] = vid_urls[i].replace('&sig=', '&signature=');
                vid_urls[i] = vid_urls[i].replace('&s=', '&signature=');
                vid_urls[i] = vid_urls[i].replace('&signaturenature=', '&signature=');

                var sig = vid_urls[i].match(/&signature=([^&]+)/)[1];
                vid_urls[i] = vid_urls[i].replace(/&signature=([^&]+)/, '&signature='+decodeSig(sig));
            }
        }
 
        return vid_urls;
    }

    function decodeSig(sig) {
        sig = sig.split("");
        sig = shuffle(sig, 12);
        sig = sig.slice(3);
        sig = shuffle(sig, 56);
        sig = sig.reverse();
        sig = sig.slice(2);
        sig = sig.reverse();
        return sig.join("");
    }

    function shuffle(sig, b){
        var c = sig[0];
        sig[0] = sig[b % sig.length];
        sig[b] = c;
        return sig;
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
 
    function displayWindow(vid_urls, title) {
        var newText = '<h1>' + title + '<\/h1><table><tr><th>&nbsp;<\/th><th>Resolution<\/th><th>Type<\/th><th>Link<\/th><\/tr>';
 
        for (var i = 0; i < vid_urls.length; i++) {
            newText += '<tr><td>' + (i+1) + '.<\/td><td>' + getSize(vid_urls[i]) + '<\/td><td>' + getVideoFormat(vid_urls[i]) + '<\/td><td><a target=\'_blank\' href=\'' + vid_urls[i] + '&title=' + encodeURIComponent(validate(title)) + '\'>Download<\/a><\/td><\/tr>';
        }
 
        var newWin = window.open('', 'yt');
        newWin.document.write(newText+'<\/table>');
    }
 
    var args = null;
    try {
        args = ytplayer.config.args;
    } catch(e) {
        alert('Sorry, an error occured. Make sure that you are currently viewing a youtube.com webpage that contains a streamming video before using this bookmarklet. But if you already done that maybe Youtube changes its webpage again. And I need to update this bookmarklet to work again.');
    } finally {
        if (args) { displayWindow(getVideoURLs(args), args.title); }
    }
})();