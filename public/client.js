document.addEventListener('DomContentLoaded', function () {
    let errorMessage = document.querySelector('.error');
    if (errorMessage.innerHTML !== '') {
        errorMessage.innerHTML = '';
        setTimeout(function () {
        }, 3000);
    }
});
