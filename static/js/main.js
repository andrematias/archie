
// Search functionality using Lunr.js
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('search-input');
    const resultsDiv = document.getElementById('search-results');

    let index;
    fetch('/index.json')
        .then(response => response.json())
        .then(data => {
            index = lunr(function () {
                this.ref('permalink');
                this.field('title', { boost: 10 });
                this.field('tags');
                this.field('summary');

                data.forEach(doc => this.add(doc));
            });
            input.addEventListener('input', function () {
                if (this.value.length < 3) {
                    resultsDiv.style.display = 'none';
                    resultsDiv.innerHTML = '';
                    return;
                }

                const results = index.search(this.value + '*'); // * para busca parcial

                if (results.length === 0) {
                    resultsDiv.innerHTML = '<ul><li>Nenhum resultado encontrado.</li></ul>';
                } else {
                    let html = '<ul>';
                    results.forEach(result => {
                        const item = data.find(d => d.permalink === result.ref);
                        html += `<li><a href="${item.permalink}">${item.title}</a></li>`;
                    });
                    html += '</ul>';
                    resultsDiv.innerHTML = html;
                }
                resultsDiv.style.display = 'block';
            });
        });
});