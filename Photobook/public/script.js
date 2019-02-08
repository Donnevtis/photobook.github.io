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
const singupButton = document.querySelector('.signup ');
let areas = [];

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
    setDragDrop();
}

function removeArea() {
    areas.forEach((elem) => {
        elem.remove();
    })
    uploadButton.addEventListener('click', showArea);
}

function setDragDrop(params) {

    areas.forEach((elemArea) => {
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

        elemArea.addEventListener('drop', handleDrop, false)

        function handleDrop(e) {
            let dt = e.dataTransfer
            let files = dt.files
            handleFiles(files)
        };

        function handleFiles(files) {
            ([...files]).forEach(uploadFile)
        };

        function uploadFile(file) {
            let url = '/photos/upload'
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
                    } else console.log('success');

                })
        };
    })
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
    const url = 'user/logout';
    const init = {
        method: 'GET'
    };

    fetch(url, init)
        .then((res) => {
            if (res.status !== 200) {
                console.log(`Looks like a problem. Status Code: ${res.status}`);
                return;
            } else {
                console.log(res)
                window.location.href = res.url;
            }
        });

}