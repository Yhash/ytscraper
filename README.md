#This is the README file of ytscraper


##Description:

ytscraper is a small javascript script that can scrap urls of a video in youtube.com. It is intented to be used as a bookmarklet for modern browsers like Google Chrome and Mozilla Firefox. When you upload a video in YouTube, YouTube will convert it in different video format and resolution. As of this writing YouTube convert uploaded videos to 3GP, MP4, FLV and WEBM while it uses 144p, 240p, 360p, 480p, 720p, 1080p and etc for resolution.


##License:

See LICENSE file for details.


##Usage:

Just make a bookmark preferably in the bookmark bar and then copy and paste the content of ytscraper.js to the url textbox of the bookmark. Then go to youtube, watch a video that you want to scrap and then click the bookmark. A new page will appear where you can see all the scrap urls.


##Supported browser(s):

This is best used in Google Chrome and Mozilla Firefox while other modern web browsers may also be used.


##Limitation(s):

Only web page of a youtube video that the url starts with http://www.youtube.com/watch? and https://www.youtube.com/watch? are supported to be scrap. And there are some instances that ytscraper will fail to gather the correct video urls. This is cause by a feature of youtube that can encode the signature of a video. And at the moment ytscraper don't have a way to decode it.