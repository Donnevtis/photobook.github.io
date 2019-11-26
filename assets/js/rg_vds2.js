const pass = document.querySelector('[name = password]');
const pass2 = document.querySelector('[name = password2]');

pass2.addEventListener('keyup', validation);

function validation(e) {
    if (pass.value !== pass2.value) {
        e.target.setCustomValidity('Password Must be Matching.');
    } else e.target.setCustomValidity('');
}