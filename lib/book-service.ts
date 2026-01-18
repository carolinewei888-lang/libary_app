
export interface BookMetadata {
  title: string;
  author: string;
  description: string;
  coverUrl: string;
  category: string;
  isbn: string;
}

export const getGoogleBookCover = async (isbn: string): Promise<string | null> => {
  const cleanIsbn = isbn.replace(/[- ]/g, '');
  if (!cleanIsbn) return null;

  // For cover updates, we prioritize OpenLibrary as requested
  return `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;
}

export const getBookByISBN = async (isbn: string): Promise<BookMetadata | null> => {
  const cleanIsbn = isbn.replace(/[- ]/g, '');
  if (!cleanIsbn) return null;

  try {
    // 1. Google Books API for Metadata (Title, Author, Desc, Category)
    const googleRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${cleanIsbn}`);
    
    if (googleRes.ok) {
        const googleData = await googleRes.json();
        
        if (googleData.items && googleData.items.length > 0) {
            const volumeInfo = googleData.items[0].volumeInfo;
            
            // PRIORITIZE OPEN LIBRARY COVER
            const coverUrl = `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-L.jpg`;

            return {
                title: volumeInfo.title,
                author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
                // Strip HTML tags if present in description
                description: volumeInfo.description ? volumeInfo.description.replace(/<[^>]*>/g, '') : '',
                category: volumeInfo.categories ? volumeInfo.categories[0] : 'General',
                coverUrl: coverUrl,
                isbn: cleanIsbn
            };
        }
    }
  } catch (e) {
    console.error("Google Books API failed", e);
  }
  
  return null;
}

// Search by title/query to find the best matching book and its correct ISBN
export const searchBookByQuery = async (query: string): Promise<BookMetadata | null> => {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=1`);
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;
    
    const info = data.items[0].volumeInfo;
    const identifiers = info.industryIdentifiers || [];
    // Prefer ISBN-13, then ISBN-10
    const isbn13 = identifiers.find((id: any) => id.type === 'ISBN_13')?.identifier;
    const isbn10 = identifiers.find((id: any) => id.type === 'ISBN_10')?.identifier;
    const isbn = isbn13 || isbn10 || '';
    
    // Construct OpenLibrary Cover if ISBN exists
    let coverUrl = '';
    if (isbn) {
        coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    } else if (info.imageLinks?.thumbnail) {
        // Fallback to Google thumbnail if no ISBN found
        coverUrl = info.imageLinks.thumbnail.replace('http:', 'https:');
    }

    return {
        title: info.title,
        author: info.authors ? info.authors.join(', ') : 'Unknown',
        description: info.description ? info.description.replace(/<[^>]*>/g, '') : '',
        category: info.categories ? info.categories[0] : 'General',
        coverUrl: coverUrl,
        isbn: isbn
    };
  } catch (error) {
    console.error("Google Books Search Error", error);
    return null;
  }
}
