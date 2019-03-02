const regForm = document.querySelector('.form-signup');
const signButton = document.querySelector('.signup');
let message;
regForm.addEventListener('keyup', validation);
regForm.addEventListener('change', validation);


function showPopup(e) {

    let elem = e.target;
    if (!message) return;
    const popup = document.createElement('div');
    popup.className = 'form-popup';
    popup.innerHTML = message;
    elem.previousSibling.appendChild(popup)
    elem.addEventListener('focus', removePopup);

    function removePopup() {
        popup.remove();
        elem.removeEventListener('focus', showPopup);
        elem.removeEventListener('blur', showPopup);
    }
}

function validation(e) {

    if (e.target.parentNode != regForm && e.type !== 'keyup') {
        unblockButton(e.target.parentNode.parentNode.elements);
        return;
    }
    const elems = e.target.parentNode.elements;
    const p1 = elems.password;
    const p2 = elems.password2;
    const pass = [p1, p2]
    const elem = e.target;
    elem.addEventListener('blur', showPopup);

    if (p1 == elem || p2 == elem) {
        checkLength(6);
    } else {
        checkLength(3);
    }

    function checkLength(length) {
        if (elem.value.length < length) {
            attention(`Too short, minimum length is ${length} characters`);
            return;
        } else {
            attention(false);
            elem.focus;
            checkMatch();
        }
    }

    function checkMatch() {
        if (p2 == elem && p1.value.length > 0 || p1 == elem && p2.value.length > 0) {

            if (p1.value !== p2.value) {
                attention('Passwords do not match');
            } else {
                pass.forEach((elem) => elem.classList.remove('wrong'));

            }
        }
    }

    function attention(error) {
        if (error) {
            message = error;
            elem.classList.add('wrong');

        } else {
            elem.classList.remove('wrong');
            message = '';
        }
    }


    unblockButton(elems);
}

function unblockButton(elems) {
    let key;
    for (const e of elems) {

        key = e.classList.contains('wrong') ? true : false;
        if (key) break;
        key = e.value ? false : true;
        if (key) break;

    }

    if (key || elems[4].checked == false) {
        signButton.disabled = true;
        return;
    }
    signButton.disabled = false;
    elem.focus;
}