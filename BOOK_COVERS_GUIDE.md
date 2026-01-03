# Book Cover API Integration Guide

## 📚 **Two Ways to Get Book Covers**

### 1. **Dynamic Loading (Recommended)**
Book covers are automatically fetched from APIs in real-time:

```javascript
// Usage in your book data
const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    src: "/books/placeholder.jpg", // Will be replaced by API cover
    review: "A masterpiece of American literature..."
  }
];
```

### 2. **Download Script for Local Storage**
Download covers to your `public/books/` folder:

```bash
# Add books to scripts/downloadBookCovers.js
# Then run:
npm run download-covers
```

## 🔧 **APIs Used**

### **Open Library API** (Primary)
- **Free** and reliable
- **No API key** required
- **Format**: `https://covers.openlibrary.org/b/isbn/{ISBN}-L.jpg`

### **Google Books API** (Fallback)
- **High quality** covers
- **1000 requests/day** free tier
- **Backup** when Open Library fails

## ⚙️ **How It Works**

1. **Automatic Detection**: The system checks if a book has a placeholder or missing cover
2. **API Search**: Searches Open Library first, then Google Books
3. **Smart Fallback**: Falls back to local images if APIs fail
4. **Visual Indicators**: Shows "API" badge when cover is loaded from external source
5. **Error Handling**: Gracefully handles failed requests

## 🚀 **Adding New Books**

### Method 1: Let the system find covers automatically
```javascript
{
  title: "Your Book Title",
  author: "Author Name",
  src: "/books/placeholder.jpg" // Will auto-replace
}
```

### Method 2: Download covers first
1. Add book to `scripts/downloadBookCovers.js`
2. Run `npm run download-covers`
3. Reference the downloaded file:
```javascript
{
  title: "Your Book Title", 
  author: "Author Name",
  src: "/books/your-book-filename.jpg"
}
```

## 📱 **Features**

- ✅ **Automatic cover detection**
- ✅ **Multiple API fallbacks**
- ✅ **Loading indicators**
- ✅ **Error recovery**
- ✅ **Batch processing**
- ✅ **Local download option**
- ✅ **Mobile responsive**

## 🛠 **Customization**

Edit `/src/utils/bookCovers.js` to:
- Add more API sources
- Modify image quality preferences  
- Customize fallback behavior
- Add caching mechanisms