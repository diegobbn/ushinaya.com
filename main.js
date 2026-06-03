fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('nav-container').innerHTML = data;

        // Page actuelle
        const currentPage = window.location.pathname
            .split('/')
            .pop()
            .replace('.html', '');

        // Lien actif
        document.querySelectorAll('.sidenav__projects a, .sidenav__meta a').forEach(link => {
            const linkPage = link
                .getAttribute('href')
                .replace('.html', '');

            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });

        // Cas particulier pour la page d'accueil
        if (
            window.location.pathname === '/' ||
            window.location.pathname.endsWith('/index.html')
        ) {
            const homeLink = document.querySelector('a[href="index.html"]');
            if (homeLink) {
                homeLink.classList.add('active');
            }
        }

        // Menu mobile
        const menuBtn = document.querySelector('.menu-toggle');
        const sidenav = document.querySelector('.sidenav');

        if (menuBtn && sidenav) {
            menuBtn.addEventListener('click', () => {
                sidenav.classList.toggle('open');
            });
        }
    })
    .catch(error => {
        console.error('Erreur chargement nav :', error);
    });