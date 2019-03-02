albumSet.albumRemove = (title) => {
    if (!confirm(`Are you sure you want to delete album '${title.firstChild.textContent}'?
    This operation cannot be undone.`)) return;
    const id = albumEnv.getAlbum(title).id;
    const album = albumEnv.getAlbum(title).album;
    const label = albumEnv.getAlbum(title).label;
    this.mail = {
        id: id
    };
    this.method = 'DELETE';
    albumSet.send()
        .then(() => {
                const counters = new Counters(-res);
                counters.setGenCount();
                album.remove();
                label.remove();
            },
            err => console.log(err)
        )
};


albumSet.albumRename = (title, key) => {
    title.classList.toggle('album__title_edit');

    if (this.isEdited) {
        albumSet.setName(title, key);
        return;
    }
    title.removeEventListener('mouseleave', albumSet.close);

    key.src = '/svg/checked.svg';
    const buffer = document.querySelector('.input-buffer');

    this.nameNode = title.firstChild;
    this.name = nameNode.textContent;

    this.input = document.createElement('input');
    input.className = 'album__name';
    input.style.background = '#C0C0C0';
    buffer.classList.add('album__name');
    input.value = name;
    const width = nameNode.offsetWidth;
    input.style.width = width + 'px';

    input.oninput = () => {
        buffer.innerHTML = input.value;
        input.style.width = buffer.offsetWidth + 'px';
    }
    input.onkeyup = (e) => {
        if (e.key !== 'Enter') return;
        albumSet.setName(title, key)
    }

    title.prepend(input);
    input.focus();
    nameNode.hidden = true;
    this.isEdited = true;
};

albumSet.setName = (title, key) => {

    key.src = '/svg/pencil-edit.svg';
    this.isEdited = false;
    nameNode.innerHTML = input.value;
    this.mail = {
        album: title.parentNode.id,
        newName: input.value
    }
    this.method = 'POST';
    input.remove();
    input = null;
    nameNode.hidden = false;
    title.addEventListener('mouseleave', albumSet.close);
    albumSet.send().then(null, () => {

        nameNode.innerHTML = name
    })
}

albumSet.send = async() => {

    try {
        await fetch('/album', {
                method: method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mail)
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
};