fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-container').innerHTML = data;

        // Lien actif
        const currentPage = window.location.pathname.split('/').pop();

        console.log("Current page:", currentPage);

        document.querySelectorAll('.sidenav__projects a').forEach(link => {
            console.log("Link:", link.getAttribute('href'));

            if (link.getAttribute('href') === currentPage) {
                console.log("MATCH");
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