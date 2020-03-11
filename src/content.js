var curr_speed = "x1"
var curr_video = 0

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if(request.type === "getAllVideos"){
        let videos = document.querySelectorAll('video')
        let iframes = document.querySelectorAll('iframe')

        let len_videos = videos.length

        function getFrameContents(id_iframe){
            var iFrame = document.getElementById(id_iframe);
            var iFrameBody;
            if (iFrame.contentDocument) {
                iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
            } else if (iFrame.contentWindow){
                iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
            }

            let videos_iframe = iFrameBody.querySelectorAll('video')

            return videos_iframe.length
        }
        
        for(let a = 0; a < iframes.length; ++a){
            let id = iframes[a].id
            len_videos += getFrameContents(id)
        }

        // chrome.runtime.sendMessage({
        //     videos: videos
        // });
        sendResponse({"tot_videos": len_videos})
        return true
    }

    function change(){
        let videos = document.querySelectorAll('video')
        let iframes = document.querySelectorAll('iframe')

        function getFrameContents(id_iframe){
            var iFrame = document.getElementById(id_iframe);
            var iFrameBody;
            if (iFrame.contentDocument) {
                iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
            } else if (iFrame.contentWindow){
                iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
            }

            let videos_iframe = iFrameBody.querySelectorAll('video')
            
            videos = [...videos, ...videos_iframe];
        }

        for(let a = 0; a < iframes.length; ++a){
            let id = iframes[a].id
            getFrameContents(id)
        }

        if(curr_speed === "x05"){
            videos[curr_video].playbackRate = 0.5
        } else if(curr_speed === "x1"){
            videos[curr_video].playbackRate = 1
        } else if(curr_speed === "x15"){
            videos[curr_video].playbackRate = 1.5
        } else if(curr_speed === "x2"){
            videos[curr_video].playbackRate = 2
        } else if(curr_speed === "x3"){
            videos[curr_video].playbackRate = 3
        }
    }

    if(request.type === "changeSpeed"){
        curr_speed = request.speed
        
        change()

        sendResponse({"done": true})
        return true
    }

    if(request.type === "changeVideo"){
        curr_video = parseInt(request.video)

        change()

        sendResponse({"done": true})
        return true
    }
})