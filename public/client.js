document.addEventListener('DOMContentLoaded', function () {
    let errorMessage = document.querySelector('.error');
    if (errorMessage.innerHTML !== '') {
        setTimeout(function () {
            errorMessage.innerHTML = '';
        }, 3000);
    }
});
