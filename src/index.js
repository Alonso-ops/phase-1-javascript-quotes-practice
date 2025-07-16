document.addEventListener('DOMContentLoaded', () => {
});
const newQuoteForm = document.getElementById('new-quote-form');
const sortBtn = document.getElementById('sort-button');
let sortByAuthor = false;

function fetchQuotes() {
    let url = 'http://localhost:3000/quotes?_embed=likes';
    if (sortByAuthor) url += '&_sort=Author';

    fetch(url)
    .then(res => res.json())
    .then(quotes => {
        quotesList.innerHTML = '';
        quotes.forEach(renderQuotes);
    });
}

function renderQuote(quote) {
    const li = document.createElement('li');
    li.className = 'quote-card';
    li.dataset.id = quote.id;

    const blockquote = documnet.createElement('blockquote');
    blockquote.className = 'blockquote';

    const p = document.createElement('p');
    p.className = 'mb-0';
    p.textContent = quote.quote;

    const footer = document.createElement('footer');
    footer.className = 'blockquote-footer';
    footer.textContent = quote.author;

    const br = documnet.createElement('br');

    const likeBtn = document.createElement('button');
    likeBtn.className = 'btn-sucess';
    const likeCount = quote.likes ? quote.likes.length : 0;
    likeBtn.innnerHTML = `Likes: <span>${likeCount}</span>`;
    likeBtn.addEventListener('click', () => handleLike(quote, likeBtn));

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-danger';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => handleDelete(quote, li));

blockquote.apppend(p, footer, br, likeBtn, deleteBtn);
li.append(blockquote);
qouteList.append(li);
}

function handleLike(quote, likeBtn) {
    fetch('http://localhost:3000/likes', {
        methid: 'POST',
        headers: {
            'Content-Type': 'application/ josn',
        },
        body: JSON.stringify({quoteId: quote.id, createdAt: Math.floor(Date.now() / 1000) })
    })
    .then(res => res.json())
    .then(() => { 
        const span = likeBtn.querySelector('span');
        span.textContent = parsenInt(span.textContent) + 1;
    });
}

function handleDelete(quote, quoteElement) {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: 'DELETE'
    })
    .then(() => quoteElement.remove());
}

newQuoteForm.addEventListener('submit', e => { 
    e.preventDefault();

    const quoteText = document.getElementById('new-quote').value;
    const author = document.getElementById('author').value;

    fetch('http://localhost:3000/quotes', {
        method:'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quote: quoteText, author: author })
        })
        .then(res => res.json())
        .then(quote => {
            quote.likes = [];
            renderQuote(quote);
            newQuoteForm.reset();
            });
         });

         if (sortBtn){
         sortBtn.addEventListener('click', () => {
            sortByAuthor = !sortByAuthor;
            sortBtn.textContent = sortByAuthor ? 'Sort by ID' : 'Sort by Author';
            fetchQuotes();
         });
        }
