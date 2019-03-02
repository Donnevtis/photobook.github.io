const slider = document.querySelector('.scale__slider'),
    fillLine = document.querySelector('.scale_slider-fill'),
    sidebarButton = document.querySelector('.sidebar-button'),
    sidebar = document.querySelector('.sidebar'),
    content = document.querySelector('.content'),
    uploadButton = document.querySelector('.upload-button'),
    menuButton = document.querySelector('.menu__button'),
    newAlButton = document.querySelector('.menu__new-album'),
    logout = document.querySelector('.logout-button');
let photoGrid = document.querySelectorAll('.album__grid');
let areas = [];

// Fetch methods
function fetchGet(url, callback, method) {
    fetch(url, { method: method || 'GET' })
        .then((res) => {
            if (res.status !== 200) {
                console.warn(`Looks like a problem. Status Code: ${res.status}`);
                return;
            } else {
                return res.text();
            }
        })
        .then(callback)
}

function uploadFile(files, url, callback, id) {
    let formData = new FormData()
    let arr = [];
    formData.append('id', id);
    ([...files]).forEach(file => arr.push(file));
    arr.forEach(file => formData.append('file', file));
    fetch(url, {
            method: 'POST',
            body: formData
        })
        .then((res) => {

            if (res.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' + res.status);
            } else return res.text();
            if (res.status === 300) {
                alert('too many files');
                console.log(res);

            };
        })
        .then(callback)

};



slider.addEventListener('input', lineSetPos);

function lineSetPos(e) {
    fillLine.style.width = e.target.value;
}

//firefox slider off
const FIREFOX = /Firefox/i.test(navigator.userAgent);
if (FIREFOX) {
    fillLine.style.display = "none";
}

//scale grid
const grid = setGrid();

slider.addEventListener('input', grid);
window.onload = grid();

function gridScale(val) {
    const size = {};
    switch (val) {
        case '0':
            {
                size.col = 6;
                size.vw = 7.5;
            }
            break;
        case '25':
            {
                size.col = 5;
                size.vw = 10;
            }
            break;
        case '50':
            {
                size.col = 4;
                size.vw = 12.5;
            }
            break;
        case '75':
            {
                size.col = 3;
                size.vw = 16;
            }
            break;
        case '100':
            {
                size.col = 2;
                size.vw = 22;
            }
            break;
    }
    return size;
}

function setGrid(e) {
    let val = '50';
    return function(e) {
        // removeArea();
        val = (typeof(e) == 'object') ? e.target.value : val;
        const size = gridScale(val);
        photoGrid.forEach(elem => {

            let r = 2;
            let cells = elem.children;

            for (const cell of cells) {
                cell.style.display = 'block'
            }

            if (size.col <= 4) {
                if (cells.length > size.col * 2) {
                    for (let i = size.col * 2; i < cells.length; i++) {
                        cells[i].style.display = 'none';
                    }
                } else {
                    r = (cells.length / size.col || 1);
                    r = Math.ceil(r);
                }

            } else if (size.col == 5 || size.col == 6) {
                r = 3;
                if (cells.length > size.col * 3) {
                    for (let i = size.col * 3; i < cells.length; i++) {
                        cells[i].style.display = 'none';
                    }
                } else {
                    r = (cells.length / size.col);
                    r = Math.ceil(r);
                }
            }

            elem.style.gridTemplateColumns = `repeat(${size.col},1fr)`;
            elem.style.gridTemplateRows = `repeat(${r} ,${size.vw}vw)`;

        });
        return val;
    }

}

//mobile version sidebar hider

sidebarButton.addEventListener('click', openSidebar);

function openSidebar() {

    sidebar.classList.add('sidebar_hide');
    content.style.display = 'flex';

    sidebarButton.removeEventListener('click', openSidebar);
    sidebarButton.addEventListener('click', closeSidebar);
}

function closeSidebar() {


    sidebar.classList.remove('sidebar_hide');
    content.style.display = 'none';

    sidebarButton.removeEventListener('click', closeSidebar);
    sidebarButton.addEventListener('click', openSidebar);
}

//upload files show area
uploadButton.addEventListener('click', showArea);

function showArea() {
    photoGrid.forEach((elem) => { addUploadAreas(elem) });
    uploadButton.removeEventListener('click', showArea);
    uploadButton.addEventListener('click', removeArea);
}

function addUploadAreas(elem) {
    let upArea = document.createElement('div');
    upArea.classList.add('upload-area');
    upArea.innerHTML = 'DRAG FILES HERE';
    elem.prepend(upArea);
    areas.push(upArea);
    let areaInput = document.createElement('input');

    areaInput.setAttribute('type', 'file');
    areaInput.className = 'upload-area__input';
    areaInput.setAttribute('accept', '.jpg, .jpeg, .png');
    areaInput.multiple = true;
    upArea.append(areaInput);
    let url = 'upload/';
    let id = elem.parentNode.id;

    // Appear new files function
    const callback = (res) => {
        removeArea();
        const container = document.createElement('div');
        container.innerHTML += res;
        let cells = container.children;
        const length = cells.length;

        for (let i = 0; i < length; i++) {
            elem.prepend(cells[0]);
        }
        const counters = new Counters(length);
        counters.setGenCount();
        counters.setCount(elem);

        let input = new Event('input');
        slider.dispatchEvent(input);
    }
    setDragDrop(upArea, url, callback, id);
}

class Counters {
    constructor(count) {
        this.count = count;
    }
    setGenCount() {
        this.node = document.querySelector('.profile__count');
        this.node.innerHTML = `${this.count + +this.prevCount()} files`;
    }
    setCount(elem) {
        this.node = elem.parentNode.querySelector('.album__count');
        this.node.innerHTML = `(${this.count + +this.prevCount()} photos)`;
    }
    prevCount() { return this.node.innerHTML.replace(/\D/g, '') }
}

function setDragDrop(elem, url, callback, title) {
    callback = callback || null;
    title = title || null;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        elem.addEventListener(eventName, preventDefaults, false)
    });

    function preventDefaults(e) {
        e.preventDefault()
        e.stopPropagation()
    };

    ['dragenter', 'dragover'].forEach(eventName => {
        elem.addEventListener(eventName, highlight, false)
    });
    ['dragleave', 'drop'].forEach(eventName => {
        elem.addEventListener(eventName, unhighlight, false)
    });

    function highlight(e) {
        elem.classList.add('upload-area_highlight')
    };

    function unhighlight(e) {
        elem.classList.remove('upload-area_highlight')
    };

    elem.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        elem.innerHTML = '<div class="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>'
        let dt = e.dataTransfer;
        let files = dt.files;
        uploadFile(files, url, callback, title);
    };
}


function removeArea() {
    areas.forEach((elem) => {
        elem.remove();
    })
    areas = [];
    uploadButton.addEventListener('click', showArea);
}

//NEW ALBUM CREATE

menuButton.addEventListener('click', showInput);


function showInput() {
    menuButton.removeEventListener('click', showInput);
    menuButton.addEventListener('click', hideInput);
    newAlButton.addEventListener('keydown', sendAlbum);
    newAlButton.style.display = 'block';
    newAlButton.focus();

}

function hideInput() {

    newAlButton.style.display = 'none';
    menuButton.removeEventListener('click', hideInput);
    menuButton.addEventListener('click', showInput);
};


function sendAlbum(e) {
    const title = e.target.value.trim();
    if (e.key !== 'Enter') return;
    hideInput();
    const url = '/create';
    const init = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title })
    };

    fetch(url, init)
        .then((res) => {
            if (res.status !== 200) {
                console.warn(`Looks like a problem. Status Code: ${res.status}`);
                return;
            } else {
                return res.text();
            }
        })
        .then(res => {
            showAlbum(title, res);
        })

    e.target.value = '';
    e.target.removeEventListener('keydown', sendAlbum);
}

function showAlbum(title, res) {
    let album = document.querySelector('.album');
    const albumNumber = (album) ? +album.firstChild.name + 1 : 0;
    const actions = document.querySelector('.actions')
    const container = document.createElement('div');
    container.innerHTML = res;
    const id = container.firstChild.id;
    container.querySelector('.album__anchor').name = albumNumber;
    const albumGrid = container.querySelector('.album__grid');
    albumsEvensHang(container.firstChild);
    actions.after(container.firstChild);
    addUploadAreas(albumGrid);
    photoGrid = document.querySelectorAll('.album__grid');

    // Menu item

    container.innerHTML =
        `<label class="menu__option"id="${albumNumber}i" name="${id}"onclick="document.location.href='#${albumNumber}'" >${title}
        <input class="menu__input" type="radio" name="albums">
        <span class="checkmark"></span></label>`

    newAlButton.after(container.firstChild);
}


// LOGOUT BUTTON
logout.addEventListener('click', leave);

function leave() {
    fetch('user/logout', { method: 'GET' })
        .then((res) => {
            if (res.status !== 200) {
                console.warn(`Looks like a problem. Status Code: ${res.status}`);
                return;
            } else {
                window.location.href = res.url;
            }
        });
}


// Redactor 
const getRedactor = document.querySelector('.profile__avatar-button');

getRedactor.addEventListener('click', Redactor);


function Redactor() {
    fetchGet('redactor', avatarRedactor)


    function avatarRedactor(box) {
        let boxShadow = document.createElement('div');
        boxShadow.className = 'box-wrapper'
        boxShadow.innerHTML = box;
        document.body.prepend(boxShadow);
        boxShadow.addEventListener('mousedown', deleteRedactor);
        boxShadow.addEventListener('wheel', (e) => e.preventDefault(), false);
        const avatarArea = document.querySelector('.photo-redactor__img');
        const avatarFade = document.querySelector('.photo-redactor__img_fade');
        const avatarThumb = document.querySelector('.photo-redactor__cropper');
        const avatarCircle = document.querySelector('.photo-redactor__cropper_circle')
        const redactor = document.querySelector('.photo-redactor');
        const ltThumb = document.querySelector('.photo-redactor__thumb_LT');
        const rtThumb = document.querySelector('.photo-redactor__thumb_RT');
        const lbThumb = document.querySelector('.photo-redactor__thumb_LB');
        const rbThumb = document.querySelector('.photo-redactor__thumb_RB');
        let originWidth = 100;
        let originHeight = 100;
        let shiftOffsetX = 0;
        let shiftOffsetY = 0;
        let cropOffsetX = 0;
        let cropOffsetY = 0;
        let width = redactor.offsetWidth;
        let height = redactor.offsetHeight;


        avatarArea.onload = (e) => {
            originWidth = e.target.naturalWidth;
            originHeight = e.target.naturalHeight;

            if (originWidth > originHeight) {
                avatarFade.style.height = '100%';
                avatarFade.style.width = 'auto';
                avatarArea.style.height = height + 'px';
                avatarArea.style.width = 'auto';
                avatarFade.addEventListener('mousedown', shiftSE);
            } else {
                avatarFade.style.width = '100%';
                avatarFade.style.height = 'auto';
                avatarArea.style.width = width + 'px';
                avatarArea.style.height = 'auto';
                avatarFade.addEventListener('mousedown', shiftNW);

            }
        };

        // Picture shift
        function shiftSE(e) {

            let offsetX = avatarFade.offsetLeft;
            let cursorX = e.clientX - offsetX;
            moveAt(e);
            document.onmousemove = function(e) {
                moveAt(e);
            };

            function moveAt(e) {
                let x = e.clientX - cursorX;
                let shiftX = Math.max(Math.min(x, 0), redactor.clientWidth - avatarFade.clientWidth);
                avatarFade.style.left = shiftX + 'px';
                shiftOffsetX = shiftX;
                thumbShifterSE(shiftOffsetX, cropOffsetX);
                document.onmouseup = function() {
                    document.onmousemove = null;
                }
            }
        };

        function shiftNW(e) {
            let offsetY = avatarFade.offsetTop;
            let cursorY = e.clientY - offsetY;

            moveAt(e);

            document.onmousemove = function(e) {
                moveAt(e);
            }

            function moveAt(e) {
                let y = e.clientY - cursorY;
                let shiftY = Math.max(Math.min(y, 0), redactor.clientHeight - avatarFade.clientHeight);
                avatarFade.style.top = shiftY + 'px';
                shiftOffsetY = shiftY;
                thumbShifterNW(shiftOffsetY, cropOffsetY);
                document.onmouseup = function() {
                    document.onmousemove = null;
                }
            }
        };

        //Thumb shift
        avatarThumb.onmousedown = function(e) {

            const startX = avatarThumb.offsetLeft;
            const startY = avatarThumb.offsetTop;
            const thumbWidth = avatarThumb.clientWidth;

            if (e.target !== avatarArea) {
                resizer()
                return;
            };

            // Crop resize
            function resizer() {
                let cursorX = e.clientX;
                let cursorY = e.clientY;
                let frame = redactor.offsetWidth;
                let right = frame - startX - thumbWidth;
                let bottom = frame - startY - thumbWidth;
                let s = 0;
                if (e.target == ltThumb) {
                    document.onmousemove = (e) => {
                        avatarFade.style.cursor = 'nw-resize';
                        let x = cursorX - e.clientX;
                        let y = cursorY - e.clientY;
                        s = Math.max(x, y);
                        let l = startX - s;
                        let t = startY - s;
                        let w = thumbWidth + s;
                        let left = Math.min(Math.max(l, Math.max(startX - startY, 0)), frame - right - 80);
                        let top = Math.min(Math.max(t, Math.max(startY - startX, 0)), frame - bottom - 80);
                        let width = Math.min(frame - right, Math.max(w, 80));
                        let height = Math.min(frame - bottom, Math.max(w, 80));
                        resize(left, top, width, height);
                    }
                }

                if (e.target == rtThumb) {
                    document.onmousemove = (e) => {
                        avatarFade.style.cursor = 'ne-resize';
                        let x = e.clientX - cursorX;
                        let y = cursorY - e.clientY;
                        s = Math.max(x, y);
                        let t = startY - s;
                        let w = thumbWidth + s;
                        let left = startX;
                        let top = Math.min(Math.max(t, Math.max(startY - right, 0)), frame - bottom - 80);
                        let width = Math.min(frame - left, Math.max(w, 80));
                        let height = Math.min(frame - bottom, Math.max(w, 80));
                        resize(left, top, width, height);
                    }
                }

                if (e.target == rbThumb) {
                    document.onmousemove = (e) => {
                        avatarFade.style.cursor = 'se-resize';
                        let x = e.clientX - cursorX;
                        let y = e.clientY - cursorY;
                        s = Math.max(x, y);
                        let left = startX;
                        let top = startY;
                        let w = thumbWidth + s;
                        let width = Math.min(frame - left, Math.max(w, 80));
                        let height = Math.min(frame - top, Math.max(w, 80));
                        resize(left, top, width, height);
                    }
                }

                if (e.target == lbThumb) {
                    document.onmousemove = (e) => {
                        avatarFade.style.cursor = 'sw-resize';
                        let x = cursorX - e.clientX;
                        let y = e.clientY - cursorY;
                        s = Math.max(x, y);
                        let l = startX - s;
                        let top = startY;
                        let w = thumbWidth + s;
                        let left = Math.min(Math.max(l, Math.max(startX - bottom, 0)), frame - right - 80);
                        let width = Math.min(frame - right, Math.max(w, 80));
                        let height = Math.min(frame - top, Math.max(w, 80));
                        resize(left, top, width, height);
                    }
                }

                function resize(left, top, width, height) {
                    avatarThumb.style.left = left + 'px';
                    avatarThumb.style.top = top + 'px';
                    avatarArea.style.left = -left - -shiftOffsetX + 'px';
                    avatarArea.style.top = -top - -shiftOffsetY + 'px';
                    avatarThumb.style.width = Math.min(width, height) + 'px';
                    avatarThumb.style.height = Math.min(width, height) + 'px';
                    avatarCircle.style.width = Math.min(width, height) + 'px';
                    avatarCircle.style.height = Math.min(width, height) + 'px';
                }

                document.onmouseup = function() {
                    avatarFade.style.cursor = 'grab';
                    if (e.target == ltThumb || e.target == lbThumb) cropOffsetX += s;
                    if (e.target == ltThumb || e.target == rtThumb) cropOffsetY += s;
                    document.onmousemove = null;
                }
            }

            const leftBoard = redactor.getBoundingClientRect().left;
            const rightBoard = redactor.clientWidth;
            const topBoard = redactor.getBoundingClientRect().top;
            const bottomBoard = redactor.clientHeight;
            const offsetX = avatarThumb.getBoundingClientRect().left;
            const offsetY = avatarThumb.getBoundingClientRect().top;
            let cursorX = e.clientX;
            let cursorY = e.clientY;
            let cursorOffX = cursorX - offsetX;
            let cursorOffY = cursorY - offsetY;

            document.onmousemove = function(e) {
                moveAt(e);

            }

            function moveAt(e) {

                let cursorX = e.clientX;
                let cursorY = e.clientY;

                let x = cursorX - leftBoard - cursorOffX;
                x = Math.max(Math.min(x, rightBoard - thumbWidth), 0);
                avatarThumb.style.left = x + 'px';

                let y = cursorY - topBoard - cursorOffY;
                y = Math.max(Math.min(y, bottomBoard - thumbWidth), 0);
                avatarThumb.style.top = y + 'px';


                cropOffsetX = -x;
                thumbShifterSE(shiftOffsetX, cropOffsetX);

                cropOffsetY = -y;
                thumbShifterNW(shiftOffsetY, cropOffsetY);

                document.onmouseup = function() {
                    document.onmousemove = null;
                }
            }

        }

        function thumbShifterSE(a, b) {
            avatarArea.style.left = a + b + 'px';
        }

        function thumbShifterNW(a, b) {
            avatarArea.style.top = a + b + 'px';
        }

        function getCoords() {
            let coords = {};
            let scale = originWidth / avatarArea.clientWidth;
            coords.width = avatarThumb.clientWidth * scale;
            coords.left = (avatarThumb.offsetLeft - avatarFade.offsetLeft) * scale;
            coords.top = (avatarThumb.offsetTop - avatarFade.offsetTop) * scale;
            return coords;
        }

        // Avatar uploader 
        const avatarInput = document.querySelector('.inputfile[type=file]');
        const avatarDropArea = document.querySelector('.avatar-drop-area');
        const path = '/redactor/upload';

        setDragDrop(avatarDropArea, path, (res) => {
            if (!res) return;
            deleteRedactor();
            avatarRedactor(res);

        });

        avatarInput.oninput = (e) => {
            let file = e.srcElement.files;
            uploadFile(file, path, (res) => {
                if (!res) return;
                deleteRedactor();
                avatarRedactor(res);

            })
        };

        //Avatar saver
        const seveAvatar = document.querySelector('.inputfile[type=submit]');
        seveAvatar.onclick = () => {
            let coords = getCoords();
            fetch('/redactor/save', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(coords)
                })
                .then(res => {
                    if (res.status == 201) {
                        const ava = document.querySelector('.profile__avatar');
                        const r = (Math.random() * 1E10).toString(32);
                        ava.src = `/redactor/avatar/${r}`;
                        deleteRedactor();
                    }

                })
        };
    }
};

// Redactor ereaser
function deleteRedactor(e) {
    let boxShadow = document.querySelector('.box-wrapper');
    if (e && e.target !== boxShadow) return;
    boxShadow.remove();
    boxShadow = null;
}

document.ondragstart = () => false;