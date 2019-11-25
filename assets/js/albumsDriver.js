import { Counters } from './script'
import "regenerator-runtime";

class AlbumSet {
    open(e) {
        e.stopPropagation()
        let del = e.target.nextSibling;
        let edit = del.nextSibling;
        del.classList.toggle('album__del_show');
        edit.classList.toggle('album__edit_show');
    }
    close(e) {
        let del = e.target.querySelector('.album__del');
        let edit = e.target.querySelector('.album__edit');
        del.classList.remove('album__del_show');
        edit.classList.remove('album__edit_show');
    }
    albumRemove(title) {

        if (!confirm(`Are you sure you want to delete album '${title.firstChild.textContent}'?
        This operation cannot be undone.`)) return;
        const id = albumEnv.getAlbum(title).id;
        const album = albumEnv.getAlbum(title).album;
        const label = albumEnv.getAlbum(title).label;
        this.mail = {
            id: id
        };
        this.method = 'DELETE';
        this.send()
            .then(res => {
                    const counters = new Counters(-res);
                    console.log(res)
                    counters.setGenCount();
                    album.remove();
                    label.remove();
                },
                err => console.log(err)
            )
    }


    albumRename(title, key) {
        title.classList.toggle('album__title_edit');

        if (this.isEdited) {
            this.setName(title, key);
            return;
        }
        title.removeEventListener('mouseleave', this.close);

        key.src = '/svg/checked.svg';
        const buffer = document.querySelector('.input-buffer');

        this.nameNode = title.firstChild;
        this.name = this.nameNode.textContent;

        this.input = document.createElement('input');
        this.input.className = 'album__name';
        this.input.style.background = '#C0C0C0';
        buffer.classList.add('album__name');
        this.input.value = this.name;
        const width = this.nameNode.offsetWidth;
        this.input.style.width = width + 'px';

        this.input.oninput = () => {
            buffer.innerHTML = this.input.value;
            this.input.style.width = buffer.offsetWidth + 'px';
        }
        this.input.onkeyup = (e) => {
            if (e.key !== 'Enter') return;
            this.setName(title, key)
        }

        title.prepend(this.input);
        this.input.focus();
        this.nameNode.hidden = true;
        this.isEdited = true;
    }

    setName(title, key) {

        key.src = '/svg/pencil-edit.svg';
        this.isEdited = false;
        this.nameNode.innerHTML = this.input.value;
        this.mail = {
            album: title.parentNode.id,
            newName: this.input.value
        }
        this.method = 'POST';
        this.input.remove();
        this.input = null;
        this.nameNode.hidden = false;
        title.addEventListener('mouseleave', this.close);
        this.send().then(null, () => {

            this.nameNode.innerHTML = this.mail.newName
        })
    }

    async send() {

        try {
            await fetch('/album', {
                    method: this.method,
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(this.mail)
                })
                .then(res => {
                    if (res.status != 200) {
                        console.warn('server trouble');
                        res.text().then(res => console.log(res))
                        throw res.status;
                    }
                    return res.text();
                })
                .then(res => {
                    this.res = res
                })

        } catch (err) {
            throw new Error(err)
        }
    }
}

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

export default class AlbumEnv {
    getAlbum(e) {
        const elem = e;
        let album = elem.parentNode;
        let id = album.id;
        let menuLabel = document.getElementsByName(id)[0]
        let menuInput = menuLabel.firstElementChild;
        return { id: id, album: album, label: menuLabel };
    }
    show(e) {
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
    }
    scale(e) {
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
    getFiles() {
        const url = `/album/${this.id}`;
        fetchGet(url, albumEnv.callback);
    }
    callback(res) {
        let container = document.createElement('div');
        container.innerHTML = res;

        for (node of container.children) {
            const cell = node.cloneNode(true);
            this.albumGrid.append(cell);
        }
        container.remove();
        container = null;
    }
    hide(e) {
        this.elem.classList.toggle('album__title_active');
        slider.removeEventListener('input', albumEnv.scale);
        slider.addEventListener('input', grid);
        slider.value = +grid();
        fillLine.style.width = slider.value + 'px';
        menuInput.checked = false;
    }
}
const albumEnv = new AlbumEnv;
const albumSet = new AlbumSet;

albumsEvensHang(document.documentElement);

export function albumsEvensHang(elem) {
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