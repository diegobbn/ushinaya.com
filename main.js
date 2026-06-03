fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-container').innerHTML = data;

        // Lien actif
        const currentPage = window.location.pathname.split('/').pop();

        document.querySelectorAll('.sidenav__projects a').forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });


        // Menu mobile
        const menuBtn = document.querySelector('.menu-toggle');
        const sidenav = document.querySelector('.sidenav');

        if (menuBtn && sidenav) {
            menuBtn.addEventListener('click', () => {
                sidenav.classList.toggle('open');
            });
        }
    });