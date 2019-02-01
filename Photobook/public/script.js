//scale slider fill
const slider = document.querySelector('.scale__slider');
const fillLine = document.querySelector('.scale_slider-fill');
const photoGrid = document.querySelectorAll('.album__grid');

// window.addEventListener('load', delCells);

// function delCells() {

//     photoGrid.forEach(elem => {
//         if (elem.children.length > 8) {
//             let num = elem.children.length;
//             for (let i = 8; i < num; ++i) {
//                 elem.children[8].remove();
//             }
//         }

//     })

// }

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

    function setGrid(col, vw) {


        let r = 2;

        photoGrid.forEach(elem => {

            if (col == 5 || col == 6) {
                r = (elem.children.length / col);
                r = Math.ceil(r);
            }
            elem.style.overflow = 'visible';
            elem.style.maxHeight = 'none';
            elem.style.gridTemplateColumns = `repeat(${col},1fr)`;
            elem.style.gridTemplateRows = `repeat(${r} ,${vw}vw)`;

        });
    }

}