const books = [
  {
    title: 'Zero to One',
    author: 'Peter Thiel',
    cover: '/books/zero-to-one.jpg',
  },
  {
    title: 'Unstoppable',
    author: 'Brian Tracy',
    cover: '/books/unstoppable.png',
  },
  {
    title: 'The Technological Republic',
    author: 'Alex Karp',
    cover: '/books/technological-republic.jpg',
  },
]

const ReadingList = () => {
  return (
    <div className="card reading-list-card">
      <p className="reading-list-tagline">
        A reading list tells more about a person than anything else.
      </p>
      <div className="bookshelf">
        {books.map((book) => (
          <div className="book" key={book.title}>
            <div className="book-cover-wrap">
              <img
                className="book-cover"
                src={book.cover}
                alt={`${book.title} by ${book.author}`}
              />
            </div>
            <span className="book-title">{book.title}</span>
            <span className="book-author">{book.author}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ReadingList
