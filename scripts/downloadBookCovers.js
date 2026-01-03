#!/usr/bin/env node

/**
 * Script to automatically download book covers from APIs
 * Usage: node scripts/downloadBookCovers.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Book list - Add your books here
const BOOKS = [
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', filename: 'great-gatsby.jpg' },
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', filename: 'to-kill-mockingbird.jpg' },
  { title: '1984', author: 'George Orwell', filename: '1984.jpg' },
  // Add more books here...
];

const BOOKS_DIR = path.join(__dirname, '..', 'public', 'books');

/**
 * Fetch book cover URL from Open Library
 */
async function fetchOpenLibraryCover(title, author) {
  return new Promise((resolve, reject) => {
    const query = author ? `title:${title} author:${author}` : title;
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=1`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (result.docs && result.docs.length > 0) {
            const book = result.docs[0];
            if (book.cover_i) {
              resolve(`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`);
              return;
            }
            if (book.isbn && book.isbn[0]) {
              resolve(`https://covers.openlibrary.org/b/isbn/${book.isbn[0]}-L.jpg`);
              return;
            }
          }
          
          resolve(null);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Download image from URL
 */
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
          fileStream.close();
          resolve(true);
        });
        
        fileStream.on('error', reject);
      } else {
        reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
      }
    }).on('error', reject);
  });
}

/**
 * Process a single book
 */
async function processBook(book) {
  const { title, author, filename } = book;
  const filepath = path.join(BOOKS_DIR, filename);
  
  // Skip if file already exists
  if (fs.existsSync(filepath)) {
    console.log(`✓ ${filename} already exists, skipping...`);
    return true;
  }
  
  console.log(`📖 Processing: ${title} by ${author}`);
  
  try {
    // Get cover URL
    const coverUrl = await fetchOpenLibraryCover(title, author);
    
    if (!coverUrl) {
      console.log(`   ❌ No cover found for ${title}`);
      return false;
    }
    
    console.log(`   🔗 Found cover: ${coverUrl}`);
    
    // Download image
    await downloadImage(coverUrl, filepath);
    console.log(`   ✅ Downloaded: ${filename}`);
    
    return true;
  } catch (error) {
    console.log(`   ❌ Error processing ${title}: ${error.message}`);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('📚 Starting book cover download process...\n');
  
  // Ensure books directory exists
  if (!fs.existsSync(BOOKS_DIR)) {
    fs.mkdirSync(BOOKS_DIR, { recursive: true });
    console.log(`📁 Created directory: ${BOOKS_DIR}\n`);
  }
  
  let successful = 0;
  let total = BOOKS.length;
  
  // Process books sequentially to avoid rate limiting
  for (const book of BOOKS) {
    const success = await processBook(book);
    if (success) successful++;
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 Results: ${successful}/${total} covers downloaded successfully!`);
  
  if (successful < total) {
    console.log('\n💡 Tip: You can manually add missing covers to the public/books/ folder');
  }
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { processBook, fetchOpenLibraryCover, downloadImage };