/* This is the main.js file */
const scriptURL = 'https://script.google.com/macros/s/AKfycbyKJ5BCwen7NSOw9iNf71CybgxjtcW599m6CbthCrOwuWJpU1u0zZ77qWSvYxUuaaiv/exec'
        const form = document.forms['aneka_busa']
        const btnKirim =document.querySelector('.btn-kirim');

        form.addEventListener('submit', e => {
            e.preventDefault()
            //ketika tombol sumbit dklik
            btnKirim.classList.toggle('.d-none');
            fetch(scriptURL, { method: 'POST', body: new FormData(form)})
            .then(response =>{ 
                //tampilkan tombol kirim
                btnKirim.classList.toggle('.d-none');
                //reset form 
                form.reset();
                console.log('Success!', response)
            })
            .catch(error => {console.error('Error!', error.message)})
        })