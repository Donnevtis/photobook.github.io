const albumEnv = {

    show: (e) => {
        albumEnv.hide();
        if (e.target.nodeName != 'DIV') {
            this.elem = e.target.parentNode;
        } else {
            this.elem = e.target;
        }
        this.album = this.elem.parentNode;
        this.elem.style.backgroundColor = 'rgba(68, 68, 68, 0.137)';
        this.albumGrid = album.lastChild;
        let count = e.target.lastChild.textContent;
        this.count = parseInt(count.substring(1));
        this.cells = albumGrid.children;
        if (this.count > 18 && this.cells.length != this.count) {
            albumEnv.getFiles();
        }
        slider.removeEventListener('input', grid);
        slider.addEventListener('input', albumEnv.scale);

        const input = new Event('input');
        slider.dispatchEvent(input);
        this.elem.removeEventListener('click', albumEnv.show, true);
        this.elem.addEventListener('click', albumEnv.hide, true);
    },
    scale: (e) => {
        this.val = e.target.value;
        this.size = gridScale(val);

        for (cell of this.cells) {
            cell.style.display = "block";
        }
        let r = (count / size.col);
        r = Math.ceil(r);
        albumGrid.style.gridTemplateColumns = `repeat(${size.col},1fr)`;
        albumGrid.style.gridTemplateRows = `repeat(${r} ,${size.vw}vw)`;
    }
}
albumEnv.getFiles = () => {
    this.id = this.album.id;
    const url = `/album/${this.id}`;
    fetchGet(url, albumEnv.callback);
}
albumEnv.callback = res => {
    let container = document.createElement('div');
    container.innerHTML = res;

    for (node of container.children) {
        const cell = node.cloneNode(true);
        this.albumGrid.append(cell);
    }
    container.remove();
    container = null;
}
albumEnv.hide = e => {
    if (this.elem) {
        this.elem.style.backgroundColor = null;
        slider.removeEventListener('input', albumEnv.scale);
        slider.addEventListener('input', grid);
        this.elem.removeEventListener('click', albumEnv.hide, true);
        this.elem.addEventListener('click', albumEnv.show, true);
    }
    grid();
}

const albumNames = document.querySelectorAll('.album__title');
albumNames.forEach(label => {
    label.addEventListener('click', albumEnv.show, true);
})