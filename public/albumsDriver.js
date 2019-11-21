function albumDisplay(e) {
    e.stopPropagation();
    if (e.target.classList.contains('album__edit')) {
        albumSet.albumRename(this, e.target);
        return;
    }
    if (e.target.classList.contains('album__del')) {
        albumSet.albumRemove(this);
        return;
    }
    if (this.classList.contains('album__title_active')) {
        albumEnv.hide(this);
        return;
    }
    albumEnv.show(this);
}

const albumEnv = {
    getAlbum: (e) => {
        this.elem = e;
        this.album = this.elem.parentNode;
        this.id = this.album.id;
        this.menuLabel = document.getElementsByName(id)[0]
        this.menuInput = menuLabel.firstElementChild;
        return { id: id, album: album, label: menuLabel };
    },
    show: (e) => {
        if (this.elem) {
            this.elem.classList.remove('album__title_active');
        }
        grid();
        albumEnv.getAlbum(e);
        this.elem.classList.add('album__title_active');
        this.albumGrid = album.lastChild;
        let count = this.elem.querySelector('.album__count').textContent;
        this.count = parseInt(count.substring(1));
        this.cells = albumGrid.children;
        if (this.count > 18 && this.cells.length != this.count) {
            albumEnv.getFiles();
        }
        this.startValue = slider.value;
        slider.removeEventListener('input', grid);
        slider.addEventListener('input', albumEnv.scale);
        const input = new Event('input');
        slider.dispatchEvent(input);




        menuInput.checked = true;
        const click = new Event('click');
        menuLabel.dispatchEvent(click);

        const link = this.elem.previousSibling.name;
        document.location.href = `#${link}i`

        return;
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
    },

    getFiles: () => {
        const url = `/album/${this.id}`;
        fetchGet(url, albumEnv.callback);
    },
    callback: res => {
        let container = document.createElement('div');
        container.innerHTML = res;

        for (node of container.children) {
            const cell = node.cloneNode(true);
            this.albumGrid.append(cell);
        }
        container.remove();
        container = null;
    },
    hide: e => {
        this.elem.classList.toggle('album__title_active');
        slider.removeEventListener('input', albumEnv.scale);
        slider.addEventListener('input', grid);
        slider.value = +grid();
        fillLine.style.width = slider.value + 'px';
        menuInput.checked = false;
    }
}
const albumSet = {
    open: (e) => {
        e.stopPropagation()
        this.del = e.target.nextSibling;
        this.edit = del.nextSibling;
        del.classList.toggle('album__del_show');
        edit.classList.toggle('album__edit_show');
    },
    close: (e) => {
        this.del = e.target.querySelector('.album__del');
        this.edit = e.target.querySelector('.album__edit');
        del.classList.remove('album__del_show');
        edit.classList.remove('album__edit_show');
    }


}


albumsEvensHang(document.documentElement);

function albumsEvensHang(elem) {
    const albumSettings = elem.querySelectorAll('.album__settings');
    const albumNames = elem.querySelectorAll('.album__title');

    albumNames.forEach(label => {
        label.addEventListener('click', albumDisplay, false);
        label.addEventListener('mouseleave', albumSet.close);
    })
    albumSettings.forEach(img => {
        img.addEventListener('click', albumSet.open);
    })
}