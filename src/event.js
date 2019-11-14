function createTag(tagName, content) {
  const tag = document.createElement(tagName)
  tag.innerHTML = content
  return tag
}

window.parent.postMessage('ok', '*')

window.addEventListener('message', e => {
  if (e.data.event === 'LOAD_SCRIPT') {
    const js = createTag('script', e.data.src);
    document.body.appendChild(js)
  } else if (e.data.event === 'LOAD_STYLE') {
    const style = createTag('style', e.data.src);
    document.head.appendChild(style)
  } else if (e.data.event === 'SET_COOKIE') {
    document.cookie = e.data.src
  }
}, false)

document.addEventListener('DOMContentLoaded', function () {
  window.parent.postMessage('ready', '*')
})

document.head.appendChild(createTag('style', `html { overflow: hidden }`))


function onElementHeightChange(elm, callback) {
  var lastHeight = elm.clientHeight, newHeight;
  (function run() {
    newHeight = elm.clientHeight;
    if (lastHeight != newHeight)
      callback();
    lastHeight = newHeight;

    if (elm.onElementHeightChangeTimer)
      clearTimeout(elm.onElementHeightChangeTimer);

    elm.onElementHeightChangeTimer = setTimeout(run, 200);
  })();
}


onElementHeightChange(document.body, function () {
  window.parent.postMessage({
    event: 'SET_HEIGHT',
    height: document.body.clientHeight
  }, '*')
});
