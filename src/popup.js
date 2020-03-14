document.addEventListener('DOMContentLoaded', function () {
    tot_video = 0
    curr_video = 0

    chrome.storage.sync.get("curr_video", function(storage){
        if(storage !== undefined && storage.curr_video !== undefined){
            curr_video = parseInt(storage.curr_video)
        }
    })

    $("#slider_speed").slider()
    $("#slider_speed").on("slide", function(slideEvt) {
        let val = slideEvt.value
        $("#speed").text(val.toFixed(1))
    })

    $("#slider_timer").slider()
    $("#slider_timer").on("slide", function(slideEvt) {
        let val = slideEvt.value
        $("#timer").text(val)
    })

    $("#slider_volume").slider()
    $("#slider_volume").on("slide", function(slideEvt) {
        let val = slideEvt.value*100
        $("#volume").text(parseInt(val))
    })

    document.getElementById("btn-pause").onclick = function() {
        document.getElementById("btn-pause").style.display = "none"
        document.getElementById("btn-play").style.display = "block"
        chrome.storage.sync.set({"pause": true}, function() {})
    }

    document.getElementById("btn-play").onclick = function() {
        document.getElementById("btn-play").style.display = "none"
        document.getElementById("btn-pause").style.display = "block"
        chrome.storage.sync.set({"play": true}, function() {})
    }

    document.getElementById("btn-forward").onclick = function() {
        chrome.storage.sync.set({"forward": true}, function() {})
    }

    document.getElementById("btn-back").onclick = function() {
        chrome.storage.sync.set({"back": true}, function() {})
    }

    function getIdxCurrVideo(){
        let select = document.getElementById("btns-videos")
        let inputs = select.querySelectorAll('input')
        for(let a = 0; a < inputs.length; ++a){
            if(inputs[a].checked === true){
                return a
            }
        }
        return -1
    }

    function addVideo(first){
        let select = document.getElementById("btns-videos")
        let label = document.createElement("label")
        let input = document.createElement("input")
        input.type = "radio"
        input.name = "dark"
        if(first === true){
            input.checked = true
        }
        let span = document.createElement("span")
        span.className = "design"
        label.appendChild(input)
        label.appendChild(span)
        select.appendChild(label)
    }

    setTimeout(function(){ 
        chrome.storage.sync.get("tot_videos", function(storage){
            tot_video = parseInt(storage.tot_videos)

            for(let a = 0; a < tot_video; ++a){
                addVideo(a === 0)
            }
        
            if(tot_video === 0){
                document.getElementById("root").style.display = "none"
                document.getElementById("root2").style.display = "block"
            } else {
                document.getElementById("root").style.display = "block"
                document.getElementById("root2").style.display = "none"
            }
        })

        window.setInterval(function(){
            curr_video = getIdxCurrVideo()
            chrome.storage.sync.set({"curr_video": curr_video}, function() {})
        }, 500);
    }, 500)

}, false)