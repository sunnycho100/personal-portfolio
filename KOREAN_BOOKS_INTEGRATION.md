# Korean Books Integration - Aladin API

## Overview
Added support for Korean books in the portfolio using the Aladin API (알라딘 Open API). Korean books are displayed in a separate accordion section below "Books that shaped my thinking".

## Features Implemented

### Database
- Added `language` field to `Book` and `BookArchive` models (values: "en" or "ko")
- Added `isbn` field to store ISBN numbers from Aladin API
- Migration: `20260111053336_add_language_and_isbn_to_books`

### Backend API
- **Aladin API Integration**: New function `searchAladinBooks(title, author)` 
  - Searches Korean books via Aladin API
  - Returns up to 5 book cover options
  - Includes ISBN, cover images, and book metadata

- **New Endpoint**: `GET /api/books/search/korean`
  - Query parameters: `title` (required), `author` (optional)
  - Returns book covers from Aladin API

- **Updated Endpoint**: `GET /api/books?language=ko`
  - Filter books by language ("en" or "ko")

- **Updated Endpoint**: `POST /api/books`
  - Now accepts `language` and `isbn` fields
  - Automatically uses Aladin for Korean books

### Frontend
- **Korean Books Accordion**: Separate section for Korean books (closed by default)
- **Search & Add UI**: 
  - Korean placeholder text (책 제목, 저자)
  - Search button: "Search Aladin (표지 선택)"
  - Integrates with Aladin API for book covers
- **Book Management**: Same carousel and delete functionality as English books

## Environment Variables

### Backend (.env)
```
ALADIN_API_KEY=ttbsuch42831430001
```

**Security Note**: The API key is configured in the backend only. It is NOT exposed to the frontend.

## API Usage Guidelines (from Aladin)

### Terms of Use
1. **개인 비영리 목적**: Personal non-commercial use allowed without restrictions
2. **공공기관**: Public institutions must display Aladin attribution
3. **영리 목적**: Commercial use NOT permitted

### Rate Limits
- **Free tier**: 5,000 queries/day
- **Premium tier**: 100,000 queries/day (requires approval)

### Attribution Requirements
- Must display: "도서 DB 제공 : 알라딘 인터넷서점(www.aladin.co.kr)"
- Product pages must link to Aladin (exclusive, no other bookstores)
- "자세히보기" or "구매하기" button linking to Aladin product page

## How to Use

### As a Developer (Developer Mode)

1. **Enable Developer Mode**: Press Ctrl+Shift+D (or Cmd+Shift+D on Mac)

2. **Add a Korean Book**:
   - Navigate to the "Books" section
   - Open the "Korean Books (한국 도서)" accordion
   - Fill in the title and author (in Korean)
   - Click "Search Aladin (표지 선택)" to see cover options
   - Or click "Quick Add" to add with default cover

3. **Search Results**: 
   - Displays up to 5 cover options from Aladin
   - Shows title, author, ISBN, and publication date
   - Click a cover to select and add to your collection

### As a Visitor

- Korean books are visible in a separate accordion
- Closed by default to prioritize English content for most users
- Can expand to view Korean book collection

## Technical Implementation

### Aladin API Request Format
```
http://www.aladin.co.kr/ttb/api/ItemSearch.aspx
  ?ttbkey={API_KEY}
  &Query={title+author}
  &QueryType=Title
  &MaxResults=5
  &SearchTarget=Book
  &output=js
  &Version=20131101
```

### Database Schema
```prisma
model Book {
  id          Int      @id @default(autoincrement())
  title       String   @db.VarChar(200)
  author      String?  @db.VarChar(150)
  imagePath   String   @db.VarChar(300)
  review      String?  @db.VarChar(500)
  language    String   @default("en") @db.VarChar(10)
  isbn        String?  @db.VarChar(20)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Files Modified

### Backend
- `server/.env` - Added ALADIN_API_KEY
- `server/prisma/schema.prisma` - Added language and isbn fields
- `server/index.js` - Added Aladin API integration and endpoints

### Frontend
- `src/components/Books.jsx` - Added Korean books section and UI
- No frontend .env changes needed (API key is backend-only)

### Database
- Migration file created and applied

## Testing

1. **Test Korean Book Search**:
   ```bash
   curl "http://localhost:4000/api/books/search/korean?title=채식주의자&author=한강"
   ```

2. **Test Adding Korean Book**:
   ```bash
   curl -X POST http://localhost:4000/api/books \
     -H "Content-Type: application/json" \
     -d '{"title":"채식주의자","author":"한강","language":"ko","isbn":"9788936433598"}'
   ```

3. **Test Fetching Korean Books**:
   ```bash
   curl "http://localhost:4000/api/books?language=ko"
   ```

## Future Enhancements

- [ ] Add book reviews in Korean
- [ ] Link to Aladin product pages (as required by API terms)
- [ ] Add "도서 DB 제공 : 알라딘" attribution
- [ ] Support for drag-and-drop Korean book covers
- [ ] Advanced search filters (genre, publication date)

## Security Notes

- ✅ API key stored in backend environment variables only
- ✅ Not exposed to frontend/client
- ✅ Rate limiting handled by Aladin (5,000/day)
- ✅ Input validation using Zod schemas
- ✅ SQL injection protection via Prisma ORM

## Support

For issues with:
- **Aladin API**: Contact openapi@aladin.co.kr
- **Portfolio code**: Check the GitHub repository
- **API key**: Stored securely in `server/.env`
