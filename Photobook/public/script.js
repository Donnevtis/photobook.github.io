const slider = document.querySelector('.scale__slider');
const fillLine = document.querySelector('.scale_slider-fill');
const photoGrid = document.querySelectorAll('.album__grid');
const sidebarButton = document.querySelector('.sidebar-button');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');
const uploadButton = document.querySelector('.upload-button');
const menuButton = document.querySelector('.menu__button');
const newAlButton = document.querySelector('.menu__new-album');
const logout = document.querySelector('.logout-button');
let areas = [];

// Fetch methods
function fetchGet(url, callback) {
    fetch('redactor', { method: 'GET' })
        .then((res) => {
            if (res.status !== 200) {
                console.warn(`Looks like a problem. Status Code: ${res.status}`);
                return;
            } else {
                return res.text();
            }
        })
        .then(callback);

}

function uploadFile(file, url, callback) {
    let formData = new FormData()
    formData.append('file', file)
    fetch(url, {
            method: 'POST',
            body: formData
        })
        .then((res) => {
            if (res.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                    response.status);
                return;
            } else return res.text();
        })
        .then(callback)

};



window.onload = setGrid(4, 12.5);

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
slider.addEventListener('input', gridScale);

function gridScale(e) {
    let val = e.target.value;

    switch (val) {
        case '0':
            setGrid(6, 7.5)
            break;
        case '25':
            setGrid(5, 10)
            break;
        case '50':
            setGrid(4, 12.5)
            break;
        case '75':
            setGrid(3, 16)
            break;
        case '100':
            setGrid(2, 22)
            break;
    }
}

function setGrid(col, vw) {
    removeArea();

    let r = 2;

    photoGrid.forEach(elem => {

        let cells = elem.children;

        for (const cell of cells) {
            cell.style.display = 'block'
        }

        if (col <= 4) {
            if (cells.length > col * 2) {
                for (let i = col * 2; i < cells.length; i++) {
                    cells[i].style.display = 'none';
                }
            }
        } else if (col == 5 || col == 6) {
            r = 3;
            if (cells.length > col * 3) {
                for (let i = col * 3; i < cells.length; i++) {
                    cells[i].style.display = 'none';
                }
            } else {
                r = (cells.length / col);
                r = Math.ceil(r);
            }
        }

        elem.style.gridTemplateColumns = `repeat(${col},1fr)`;
        elem.style.gridTemplateRows = `repeat(${r} ,${vw}vw)`;
    });

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

    photoGrid.forEach((elem) => {

        let upArea = document.createElement('div');
        upArea.classList.add('upload-area');
        upArea.style.top = elem.offsetTop + 'px';
        upArea.style.left = elem.offsetLeft + 'px';
        upArea.style.width = elem.offsetWidth + 'px';
        upArea.style.height = elem.offsetHeight + 'px';
        upArea.innerHTML = 'DRAG FILE HERE';
        content.append(upArea);
        areas.push(upArea);
        let areaInput = document.createElement('input');
        areaInput.setAttribute('placeholder', 'DRAG FILE HERE');
        areaInput.setAttribute('type', 'file');
        areaInput.className = 'upload-area__input';
        areaInput.setAttribute('accept', 'image/*');
        areaInput.multiple = 'true';
        upArea.append(areaInput);
    })
    uploadButton.removeEventListener('click', showArea);
    uploadButton.addEventListener('click', removeArea);
    let url = '/photos/upload';
    setDragDrop(areas, url);
}

function removeArea() {
    areas.forEach((elem) => {
        elem.remove();
    })
    uploadButton.addEventListener('click', showArea);
}

function setDragDrop(elems, url, callback) {
    callback = callback || null;
    elems.forEach((elemArea) => {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            elemArea.addEventListener(eventName, preventDefaults, false)
        })


        function preventDefaults(e) {
            e.preventDefault()
            e.stopPropagation()
        };

        ['dragenter', 'dragover'].forEach(eventName => {
            elemArea.addEventListener(eventName, highlight, false)
        });
        ['dragleave', 'drop'].forEach(eventName => {
            elemArea.addEventListener(eventName, unhighlight, false)
        });

        function highlight(e) {
            elemArea.classList.add('upload-area_highlight')
        };

        function unhighlight(e) {
            elemArea.classList.remove('upload-area_highlight')
        };

        elemArea.addEventListener('drop', handleDrop, false);

    })

    function handleDrop(e) {
        let dt = e.dataTransfer
        let files = dt.files
        handleFiles(files)
    };

    function handleFiles(files) {
        ([...files]).forEach(file => uploadFile(file, url, callback));
    };


}

//NEW ALBUM CREATE

menuButton.addEventListener('click', addAlbum);

function addAlbum() {
    const event = new Event('focus');
    newAlButton.style.display = 'block';
    newAlButton.focus();
    newAlButton.onblur = () => newAlButton.style.display = 'none';
    newAlButton.addEventListener('keydown', sendAlbum)
}

function sendAlbum(e) {
    if (e.key !== 'Enter') return;

    const url = '/create';

    const init = {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: e.target.value })
    };

    fetch(url, init)
        .then((res) => {
            if (res.status !== 200) {
                console.log(`Looks like a problem. Status Code: ${res.status}`);
                return;
            } else { console.log(res.body) }
        });

    e.target.value = '';
    e.target.style.display = 'none';
    e.target.removeEventListener('keydown', sendAlbum);
}

// LOGOUT BUTTON
logout.addEventListener('click', out);

function out() {
    fetch('user/logout', { method: 'GET' })
        .then((res) => {
            if (res.status !== 200) {
                console.warn(`Looks like a problem. Status Code: ${res.status}`);
                return;
            } else {
                window.location.href = res.url
            }
        });
}


// Redactor 
const getRedactor = document.querySelector('.profile__avatar-button');

getRedactor.addEventListener('click', fetchRedactor);


function fetchRedactor() {
    fetchGet('redactor', avatarRedactor)


    function avatarRedactor(box) {
        let boxShadow = document.createElement('div');
        boxShadow.className = 'box-wrapper'
        boxShadow.innerHTML = box;
        document.body.prepend(boxShadow);

        const avatarArea = document.querySelector('.photo-redactor__img');
        const avatarFade = document.querySelector('.photo-redactor__img_fade');
        const avatarThumb = document.querySelector('.photo-redactor__cropper');
        const avatarCircle = document.querySelector('.photo-redactor__cropper_circle')
        const redactor = document.querySelector('.photo-redactor');
        const image = document.querySelector('.photo-redactor__img');
        const ltThumb = document.querySelector('.photo-redactor__thumb_LT');
        const rtThumb = document.querySelector('.photo-redactor__thumb_RT');
        const lbThumb = document.querySelector('.photo-redactor__thumb_LB');
        const rbThumb = document.querySelector('.photo-redactor__thumb_RB');
        let originSize = 100;
        let shiftOffsetX = 0;
        let cropOffsetX = 0;


        avatarArea.onload = (e) => {
            originSize = e.target.naturalWidth;
            console.log(originSize)
        }


        // Picture shift
        avatarFade.onmousedown = function(e) {

            let offsetX = avatarFade.offsetLeft;
            let cursor = e.clientX - offsetX;
            moveAt(e);

            document.onmousemove = function(e) {
                moveAt(e);
            }

            function moveAt(e) {

                let x = e.clientX - cursor;
                let offset = Math.max(Math.min(x, 0), redactor.clientWidth - image.clientWidth);
                avatarFade.style.left = offset + 'px';

                shiftOffsetX = offset;

                thumbShifter(shiftOffsetX, cropOffsetX);

                document.onmouseup = function() {
                    document.onmousemove = null;
                }
            }
        }

        //Thumb shift
        avatarThumb.onmousedown = function(e) {

            const startX = avatarThumb.offsetLeft;
            const startY = avatarThumb.offsetTop;
            const avatarStartX = avatarArea.offsetLeft;
            const avatarStartY = avatarArea.offsetTop;
            const leftBoard = redactor.getBoundingClientRect().left;
            const rightBoard = redactor.clientWidth;
            const topBoard = redactor.getBoundingClientRect().top;
            const bottomBoard = redactor.clientHeight;
            const thumbWidth = avatarThumb.clientWidth;

            if (e.target !== avatarArea) {
                resizer()
                return;
            };

            // Thumb resize
            function resizer() {

                if (e.target == ltThumb) {
                    let cursorX = e.clientX;
                    let cursorY = e.clientY;
                    document.onmousemove = function(e) {
                        lt(e, cursorX, cursorY, (s) => {
                            avatarThumb.style.left = startX - s + 'px';
                            avatarThumb.style.top = startY - s + 'px';
                            avatarArea.style.left = avatarStartX + s + 'px';
                            avatarArea.style.top = avatarStartY + s + 'px';
                        });
                    }
                }

                if (e.target == rtThumb) {
                    let cursorX = e.clientX;
                    let cursorY = e.clientY;
                    document.onmousemove = function(e) {
                        rt(e, cursorX, cursorY, (s) => {
                            avatarThumb.style.top = startY - s + 'px';
                            avatarArea.style.top = avatarStartY + s + 'px';
                        });
                    }
                }

                if (e.target == lbThumb) {
                    let cursorX = e.clientX;
                    let cursorY = e.clientY;
                    document.onmousemove = function(e) {
                        lb(e, cursorX, cursorY, (s) => {
                            avatarThumb.style.left = startX - s + 'px';
                            avatarArea.style.left = avatarStartX + s + 'px';
                        });
                    }
                }

                if (e.target == rbThumb) {
                    let cursorX = e.clientX;
                    let cursorY = e.clientY;
                    document.onmousemove = function(e) {
                        rb(e, cursorX, cursorY, () => {});
                    }
                }

                function lt(e, sX, sY, standAt) {
                    let x = sX - e.clientX;
                    let y = sY - e.clientY;
                    let s = Math.max(x, y);
                    standAt(s);
                    sizeAt(s);
                }

                function rt(e, sX, sY, standAt) {
                    let x = e.clientX - sX;
                    let y = sY - e.clientY;
                    let s = Math.max(x, y);
                    standAt(s);
                    sizeAt(s);
                }

                function lb(e, sX, sY, standAt) {
                    let x = sX - e.clientX;
                    let y = e.clientY - sY;
                    let s = Math.max(x, y);
                    standAt(s);
                    sizeAt(s);
                }

                function rb(e, sX, sY, standAt) {
                    let x = e.clientX - sX;
                    let y = e.clientY - sY;
                    let s = Math.max(x, y);
                    standAt(s);
                    sizeAt(s);
                }

                function sizeAt(s) {

                    avatarThumb.style.width = thumbWidth + s + 'px';
                    avatarThumb.style.height = thumbWidth + s + 'px';
                    avatarCircle.style.width = thumbWidth + s + 'px';
                    avatarCircle.style.height = thumbWidth + s + 'px';
                    avatarArea.style.cursor = 'se-resize';
                    avatarFade.style.cursor = 'se-resize';

                    document.onmouseup = function() {
                        if (e.target == ltThumb || e.target == lbThumb) cropOffsetX += s;
                        avatarArea.style.cursor = 'move';
                        avatarFade.style.cursor = 'grab';
                        document.onmousemove = null;
                    }
                }
            }

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
                thumbShifter(shiftOffsetX, cropOffsetX);

                avatarArea.style.top = -y + 'px';
                document.onmouseup = function() {
                    document.onmousemove = null;
                }
            }
        }

        function thumbShifter(a, b) {
            avatarArea.style.left = a + b + 'px';
        }

        function getCoords() {
            let coords = {};
            let scale = originSize / avatarArea.clientWidth;
            console.log(scale)
            coords.width = avatarThumb.clientWidth * scale;
            coords.left = (avatarThumb.offsetLeft - avatarFade.offsetLeft) * scale;
            coords.top = (avatarThumb.offsetTop - avatarFade.offsetTop) * scale;
            return coords;
        }

        // Avatar uploader 
        const avatarInput = document.querySelector('.inputfile[type=file]');
        const avatarDropArea = document.querySelectorAll('.avatar-drop-area');
        const path = '/redactor/upload';

        setDragDrop(avatarDropArea, path, (res) => {
            deleteRedactor();
            avatarRedactor(res);
        });

        avatarInput.oninput = (e) => {
            let file = e.srcElement.files[0];
            uploadFile(file, path, (res) => {
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
                    console.log(res.status);

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
function deleteRedactor() {
    let boxShadow = document.querySelector('.box-wrapper');
    boxShadow.remove();
    boxShadow = null;
}

document.ondragstart = () => false;