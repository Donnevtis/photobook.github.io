// Avatar redactor
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
let shiftOffsetX = 0;
let cropOffsetX = 0;



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

    const thumbWidth = avatarThumb.clientWidth;
    const startX = avatarThumb.offsetLeft;
    const startY = avatarThumb.offsetTop;
    const avatarStartX = avatarArea.offsetLeft;
    const avatarStartY = avatarArea.offsetTop;
    const leftBoard = redactor.getBoundingClientRect().left;
    const rightBoard = redactor.clientWidth;
    const topBoard = redactor.getBoundingClientRect().top;
    const bottomBoard = redactor.clientHeight;

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

document.ondragstart = function() {
    return false;
};

// Avatar uploader 
// const avatarDropArea = document.querySelectorAll('.avatar-upload-area');
// setDragDrop(avatarDropArea);