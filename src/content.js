var curr_speed = "x1"
var curr_video = -1

chrome.runtime.onConnect.addListener((port) => {
    port.onMessage.addListener((request) => {
        if(request.type === "getAllVideos"){
            var videos = document.querySelectorAll('video')
            var iframes = document.querySelectorAll('iframe')
    
            var len_videos = videos.length
    
            function getFrameContents(id_iframe){
                var iFrame = document.getElementById(id_iframe);
                var iFrameBody;
                if (iFrame.contentDocument) {
                    iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
                } else if (iFrame.contentWindow){
                    iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
                }
    
                var videos_iframe = iFrameBody.querySelectorAll('video')
                len_videos += videos_iframe.length
            }
            
            for(let a = 0; a < iframes.length; ++a){
                let id = iframes[a].id
                getFrameContents(id)
            }
    
            port.postMessage({"tot_videos": len_videos})
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
            
            var speed = 1
            if(curr_speed === "x05"){
                speed = 0.5
            } else if(curr_speed === "x1"){
                speede = 1
            } else if(curr_speed === "x15"){
                speed = 1.5
            } else if(curr_speed === "x2"){
                speed = 2
            } else if(curr_speed === "x3"){
                speed = 3
            }
    
            if(curr_video === -1){
                if(videos.length > 0){
                    curr_video = 0
                    videos[curr_video].playbackRate = speed
                }
            } else {
                videos[curr_video].playbackRate = speed
            }
        }
    
        if(request.type === "changeSpeed"){
            curr_speed = request.speed
            change()
        }
    
        if(request.type === "changeVideo"){
            curr_video = parseInt(request.video)
            change()
        }
    });
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if(request.type === "getAllVideos"){
//         var videos = document.querySelectorAll('video')
//         var iframes = document.querySelectorAll('iframe')

//         var len_videos = videos.length

//         function getFrameContents(id_iframe){
//             var iFrame = document.getElementById(id_iframe);
//             var iFrameBody;
//             if (iFrame.contentDocument) {
//                 iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
//             } else if (iFrame.contentWindow){
//                 iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
//             }

//             var videos_iframe = iFrameBody.querySelectorAll('video')
//             len_videos += videos_iframe.length
//         }
        
//         for(let a = 0; a < iframes.length; ++a){
//             let id = iframes[a].id
//             getFrameContents(id)
//         }

//         sendResponse({"tot_videos": len_videos})
//         return true
//     }

//     function change(){
//         let videos = document.querySelectorAll('video')
//         let iframes = document.querySelectorAll('iframe')

//         function getFrameContents(id_iframe){
//             var iFrame = document.getElementById(id_iframe);
//             var iFrameBody;
//             if (iFrame.contentDocument) {
//                 iFrameBody = iFrame.contentDocument.getElementsByTagName('body')[0];
//             } else if (iFrame.contentWindow){
//                 iFrameBody = iFrame.contentWindow.document.getElementsByTagName('body')[0];
//             }

//             let videos_iframe = iFrameBody.querySelectorAll('video')
            
//             videos = [...videos, ...videos_iframe];
//         }

//         for(let a = 0; a < iframes.length; ++a){
//             let id = iframes[a].id
//             getFrameContents(id)
//         }
        
//         var speed = 1
//         if(curr_speed === "x05"){
//             speed = 0.5
//         } else if(curr_speed === "x1"){
//             speede = 1
//         } else if(curr_speed === "x15"){
//             speed = 1.5
//         } else if(curr_speed === "x2"){
//             speed = 2
//         } else if(curr_speed === "x3"){
//             speed = 3
//         }

//         if(curr_video === -1){
//             if(videos.length > 0){
//                 curr_video = 0
//                 videos[curr_video].playbackRate = speed
//             }
//         } else {
//             videos[curr_video].playbackRate = speed
//         }
//     }

//     if(request.type === "changeSpeed"){
//         curr_speed = request.speed
//         change()
//     }

//     if(request.type === "changeVideo"){
//         curr_video = parseInt(request.video)
//         change()
//     }

//     sendResponse()
//     return true
// })