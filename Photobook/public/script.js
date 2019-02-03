const slider = document.querySelector('.scale__slider');
const fillLine = document.querySelector('.scale_slider-fill');
const photoGrid = document.querySelectorAll('.album__grid');
const sidebarButton = document.querySelector('.sidebar-button');
const sidebar = document.querySelector('.sidebar');
const content = document.querySelector('.content');

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