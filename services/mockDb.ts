
import { Book, User } from '../types';
import { getGoogleBookCover } from '../lib/book-service';

const STORAGE_KEY_BOOKS = 'libri_books_valsoft_v5'; 
const STORAGE_KEY_DELETED_BOOKS = 'libri_deleted_books_v5';
const STORAGE_KEY_USER = 'libri_user';

// --- VALSOFT LIBRARY DATASET (From CSV) ---
const CSV_BOOKS: Book[] = [
  {
    id: "020315d2-aba6-4b37-b3cf-6077e3c751fe",
    title: "The Richest Man in Babylon",
    author: "George S. Clason",
    isbn: "9780451205360",
    description: "The Success Secrets of the Ancients.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780451205360-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "020e287e-f512-4f2c-9038-2549d753767a",
    title: "The Undiscovered Self",
    author: "Carl G. Jung",
    isbn: "9780451217325",
    description: "The dilemma of the individual in today's society.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780451217325-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "02b0d8c5-320a-4eed-b60e-eb2cf9086c36",
    title: "A New Earth",
    author: "Eckhart Tolle",
    isbn: "9780452289963",
    description: "Awakening to Your Life's Purpose.",
    category: "Spirituality",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780452289963-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "05324fce-a2a4-41f0-ac2c-db5d7b782a7b",
    title: "Antifragile",
    author: "Nassim Nicholas Taleb",
    isbn: "9780812979688",
    description: "Things That Gain from Disorder.",
    category: "Philosophy",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780812979688-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "07e00a19-08a5-40f2-bfbd-5e69fbdc4205",
    title: "Shoe Dog",
    author: "Phil Knight",
    isbn: "9781501135910",
    description: "A Memoir by the Creator of Nike.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501135927-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "08ca314b-215c-4eae-a872-844ad212407a",
    title: "Predictably Irrational",
    author: "Dan Ariely",
    isbn: "9780061353239",
    description: "The Hidden Forces That Shape Our Decisions.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061353239-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "09b7642c-3372-40d9-a2d2-8ea7ab91996a",
    title: "Money: Master the Game",
    author: "Tony Robbins",
    isbn: "9781476757803",
    description: "7 Simple Steps to Financial Freedom.",
    category: "Finance",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781476757803-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "09bbb660-169f-4d35-a091-8f23f033c247",
    title: "Flow",
    author: "Mihaly Csikszentmihalyi",
    isbn: "9780061339202",
    description: "The Psychology of Optimal Experience.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061339202-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "119a8844-dcc3-4883-bb3c-7072c2325eb4",
    title: "Stillness Is the Key",
    author: "Ryan Holiday",
    isbn: "9780525538585",
    description: "An Ancient Strategy for Modern Life.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525538585-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "12d4fb45-bcec-44e7-b19c-f92f83054265",
    title: "Quiet",
    author: "Susan Cain",
    isbn: "9780307352156",
    description: "The Power of Introverts in a World That Can't Stop Talking.",
    category: "Psychology",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307352156-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "1430d27b-ebbd-49fe-bbdc-a6f17b20687e",
    title: "Mindset",
    author: "Carol S. Dweck",
    isbn: "9780345472328",
    description: "The New Psychology of Success.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780345472328-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "1463a649-1864-43d6-9f0b-fb3c688b0c02",
    title: "ReWork",
    author: "Jason Fried",
    isbn: "9780307463746",
    description: "Change the Way You Work Forever.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307463746-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "17a16cd9-f422-431e-a261-996071c09d52",
    title: "One Up On Wall Street",
    author: "Peter Lynch",
    isbn: "9780743200400",
    description: "How To Use What You Already Know To Make Money.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780743200400-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "185ced40-f909-4ce5-af1e-1e8827cfa243",
    title: "Crossing the Chasm",
    author: "Geoffrey A. Moore",
    isbn: "9780062292988",
    description: "Marketing and Selling Disruptive Products to Mainstream Customers.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062292988-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "1977be32-be0f-423c-b7a2-f21ad808da9e",
    title: "Great by Choice",
    author: "Jim Collins",
    isbn: "9780062120991",
    description: "Uncertainty, Chaos, and Luck.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062120991-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "222b6f7e-3d46-4598-a0a9-36fe33f1c511",
    title: "Extreme Ownership",
    author: "Jocko Willink",
    isbn: "9781250067050",
    description: "How U.S. Navy SEALs Lead and Win.",
    category: "Leadership",
    status: "AVAILABLE",
    coverUrl: "https://books.google.com/books/content?id=F5PxCgAAQBAJ&printsec=frontcover&img=1&zoom=0&source=gbs_api",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "230ca29a-f7f7-4bab-91bc-22d2450feee6",
    title: "Rising Strong",
    author: "Brené Brown",
    isbn: "9780812985801",
    description: "The Reckoning. The Rumble. The Revolution.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780812985801-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "23554935-8757-49f3-a6a6-09b7ed342380",
    title: "The Obstacle Is the Way",
    author: "Ryan Holiday",
    isbn: "9781591846352",
    description: "The Timeless Art of Turning Trials into Triumph.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591846352-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "23a77feb-b377-4841-b1f6-4cb52ad61735",
    title: "The Light We Carry",
    author: "Michelle Obama",
    isbn: "9780593237465",
    description: "Overcoming in Uncertain Times.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780593237465-L.jpg",
    createdAt: "2026-01-18 19:27:26.029423+00",
    isTrending: true
  },
  {
    id: "23fcd089-2268-4648-8989-abb2d9df794d",
    title: "Start with Why",
    author: "Simon Sinek",
    isbn: "9781591846444",
    description: "How Great Leaders Inspire Everyone to Take Action.",
    category: "Leadership",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591846444-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "2482bef8-6107-419d-8f80-a7c6c46587a9",
    title: "Tools of Titans",
    author: "Tim Ferriss",
    isbn: "9781328683786",
    description: "The Tactics, Routines, and Habits of Billionaires.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781328683786-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "2558a501-39fe-4b96-a502-e9c1ef21e2a7",
    title: "The Alchemist",
    author: "Paulo Coelho",
    isbn: "9780062315007",
    description: "A Fable About Following Your Dream.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "25a39201-b5f2-46d9-b998-a7bb999e913d",
    title: "The Algebra of Wealth",
    author: "Scott Galloway",
    isbn: "9780593714027",
    description: "A Simple Formula for Financial Security.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780593714027-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "2b00c9d9-075c-4191-b8d2-498c6eebead0",
    title: "Poor Charlie's Almanack",
    author: "Peter D. Kaufman",
    isbn: "9781578645015",
    description: "The Wit and Wisdom of Charles T. Munger.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781578645015-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "2d580ba6-e3e9-4163-a0b0-440fda4fc634",
    title: "Deep Work",
    author: "Cal Newport",
    isbn: "9781455586691",
    description: "Rules for Focused Success in a Distracted World.",
    category: "Productivity",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781455586691-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "2ef11906-569c-48ac-8a25-e7e9edcf9f04",
    title: "The Power of Habit",
    author: "Charles Duhigg",
    isbn: "9781400069286",
    description: "Why We Do What We Do in Life and Business.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781400069286-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "2f9bdb92-0f61-4466-9d82-73b4b3d8b1fc",
    title: "Leonardo da Vinci",
    author: "Walter Isaacson",
    isbn: "9781501139154",
    description: "The Biography.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501139154-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "316fa955-2935-418b-a998-8bb2921a2128",
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    isbn: "9781585424337",
    description: "The Landmark Bestseller.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781585424337-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "3541fa03-166e-4302-9ba3-9088dac89af1",
    title: "A World Without Email",
    author: "Cal Newport",
    isbn: "9780525536550",
    description: "Reimagining Work in an Age of Communication Overload.",
    category: "Productivity",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525536550-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "36cd2d5e-f7e6-4d11-8cf5-c67ad477537a",
    title: "The Bomber Mafia",
    author: "Malcolm Gladwell",
    isbn: "9780316296618",
    description: "A Dream, a Temptation, and the Longest Night of the Second World War.",
    category: "History",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316296618-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "3b9fca21-8e67-4537-bc4a-4c601c19aecf",
    title: "Modern Man in Search of a Soul",
    author: "Carl G. Jung",
    isbn: "9780156612067",
    description: "Essays on dream analysis and the spiritual problem of modern man.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780156612067-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "3bc9d2d7-2420-426b-8644-098e156dca03",
    title: "Leaders Eat Last",
    author: "Simon Sinek",
    isbn: "9781591845324",
    description: "Why Some Teams Pull Together and Others Don't.",
    category: "Leadership",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591845324-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "3bf2ebb1-d0a6-47bb-acdb-fe2083410f97",
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "9780374275631",
    description: "The two systems that drive the way we think.",
    category: "Psychology",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780374275631-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "40816b76-b045-4a38-8639-24dd5dcba44c",
    title: "The Man Who Solved the Market",
    author: "Gregory Zuckerman",
    isbn: "9780735217980",
    description: "How Jim Simons Launched the Quant Revolution.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735217980-L.jpg",
    createdAt: "2026-01-18 20:07:02.272182+00"
  },
  {
    id: "418d3de0-bb1f-4d72-a161-a1848c746be9",
    title: "Good to Great",
    author: "Jim Collins",
    isbn: "9780066620992",
    description: "Why Some Companies Make the Leap and Others Don't.",
    category: "Leadership",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780066620992-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "42310db9-1c81-46d9-93ba-84e9a57e6bdf",
    title: "Becoming",
    author: "Michelle Obama",
    isbn: "9781524763138",
    description: "Her life, her journey, and her voice.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg",
    createdAt: "2026-01-18 19:27:26.029423+00"
  },
  {
    id: "4498729b-b899-491b-8659-219ec35b3720",
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "9780735211292",
    description: "Tiny Changes, Remarkable Results.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "46283293-6085-4706-8be5-062457e7446c",
    title: "Digital Minimalism",
    author: "Cal Newport",
    isbn: "9780525536512",
    description: "Choosing a Focused Life in a Noisy World.",
    category: "Productivity",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525536512-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "4663d6b1-2958-4b13-9fd2-8f5c3a64579a",
    title: "David and Goliath",
    author: "Malcolm Gladwell",
    isbn: "9780316204361",
    description: "Underdogs, Misfits, and the Art of Battling Giants.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316204361-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "46ff6f50-dd39-4fa0-9591-b4ba65077ee8",
    title: "The Dip",
    author: "Seth Godin",
    isbn: "9781591841661",
    description: "A Little Book That Teaches You When to Quit.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591841661-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "474ca656-cbed-4f03-bd7f-85d017e8f019",
    title: "The Automatic Millionaire",
    author: "David Bach",
    isbn: "9780451208422",
    description: "A Powerful One-Step Plan to Live and Finish Rich.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780451208422-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "487254d8-5682-4e3e-b71e-eb184331c8b9",
    title: "The Laws of Human Nature",
    author: "Robert Greene",
    isbn: "9780525428145",
    description: "Decoding the behavior of the people around you.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525428145-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "4bd71719-4b34-4508-bdea-9301af43674b",
    title: "The Millionaire Next Door",
    author: "Thomas J. Stanley",
    isbn: "9781589795471",
    description: "The Surprising Secrets of America's Wealthy.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781589795471-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "4d3d23d0-c8b6-4cf2-b7a1-cf325b94f822",
    title: "The Ride of a Lifetime",
    author: "Robert Iger",
    isbn: "9780399592096",
    description: "The Lesson Learned from 15 Years as CEO of the Walt Disney Company.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780399592096-L.jpg",
    createdAt: "2026-01-18 20:07:02.272182+00"
  },
  {
    id: "4ed6b88d-49b8-4da1-9452-a5388f80dc65",
    title: "Benjamin Franklin",
    author: "Walter Isaacson",
    isbn: "9780743258074",
    description: "An American Life.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780743258074-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "4f0b2074-1e0b-47f0-8657-b3602a18dbf2",
    title: "Blue Ocean Strategy",
    author: "W. Chan Kim",
    isbn: "9781591396192",
    description: "How to Create Uncontested Market Space.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591396192-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "4f3ccac2-03bc-4169-9122-647033ca6d24",
    title: "Unshakeable",
    author: "Tony Robbins",
    isbn: "9781501164583",
    description: "Your Financial Freedom Playbook.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501164583-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "5276e866-36e7-40ad-9106-ccc2ff8927da",
    title: "Damn Right!",
    author: "Janet Lowe",
    isbn: "9780471244738",
    description: "Behind the Scenes with Berkshire Hathaway Billionaire Charlie Munger.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780471244738-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "56e826e6-1162-4605-a068-31dba30120df",
    title: "Built to Last",
    author: "Jim Collins",
    isbn: "9780060516406",
    description: "Successful Habits of Visionary Companies.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060516406-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "58031296-4c79-417a-b4f7-77807f7a14ec",
    title: "The 5 Second Rule",
    author: "Mel Robbins",
    isbn: "9781682612385",
    description: "Transform your Life, Work, and Confidence.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781682612385-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "5858106d-0df7-4d13-bc45-c207c5d0fe50",
    title: "The 4-Hour Workweek",
    author: "Tim Ferriss",
    isbn: "9780307465351",
    description: "Escape 9-5, Live Anywhere, and Join the New Rich.",
    category: "Productivity",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307465351-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "594df48a-f5a2-4365-89c0-8370af90b80c",
    title: "The Millionaire Fastlane",
    author: "MJ DeMarco",
    isbn: "9780984358106",
    description: "Crack the Code to Wealth and Live Rich for a Lifetime.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780984358106-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "5a8d8f11-2d23-4444-8bd4-10ad414c64c2",
    title: "Grit",
    author: "Angela Duckworth",
    isbn: "9781501111105",
    description: "The Power of Passion and Perseverance.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501111105-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "5a8e74db-7c71-4a80-894f-d4eeabbf8f58",
    title: "Trust Me, I'm Lying",
    author: "Ryan Holiday",
    isbn: "9781591845539",
    description: "Confessions of a Media Manipulator.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591845539-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "5c29c58d-5da6-4466-a074-0993a1b75fea",
    title: "The Rational Optimist",
    author: "Matt Ridley",
    isbn: "9780061452055",
    description: "How Prosperity Evolves.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061452055-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "5dd94fe1-a088-40b4-9c3a-5295bcebd54e",
    title: "Meditations",
    author: "Marcus Aurelius",
    isbn: "9780812968255",
    description: "A New Translation.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780812968255-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "5e4f28a9-88d1-4a12-8035-7df4f6485a75",
    title: "The Miracle Morning",
    author: "Hal Elrod",
    isbn: "9780979019715",
    description: "The Not-So-Obvious Secret Guaranteed to Transform Your Life.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780979019715-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "60d4799d-09c7-49fa-b025-b3504eadfd20",
    title: "Rich Dad's Cashflow Quadrant",
    author: "Robert T. Kiyosaki",
    isbn: "9781612680057",
    description: "Guide to Financial Freedom.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781612680057-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "6266f574-9aaa-48ec-9880-f5343d2e8f4d",
    title: "Die With Zero",
    author: "Bill Perkins",
    isbn: "9780358099765",
    description: "Getting All You Can from Your Money and Your Life.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780358099765-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "63bfb366-2525-4eed-9663-f83bbe7e4436",
    title: "Company of One",
    author: "Paul Jarvis",
    isbn: "9781328972354",
    description: "Why Staying Small Is the Next Big Thing.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781328972354-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "64ad7618-cb70-4987-bc72-b46c2f7fb490",
    title: "Principles",
    author: "Ray Dalio",
    isbn: "9781501124020",
    description: "Life and Work.",
    category: "Leadership",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501124020-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "66585179-b777-4490-af9e-a7ddaeabb86b",
    title: "The Almanack of Naval Ravikant",
    author: "Eric Jorgenson",
    isbn: "9781544514215",
    description: "A Guide to Wealth and Happiness.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781544514215-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "6874bfbc-e4a5-4376-810c-97cdfdf6f4e1",
    title: "The Let Them Theory",
    author: "Mel Robbins",
    isbn: "9781401977122",
    description: "A Life-Changing Tool to Find Peace.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://books.google.com/books/content?id=qOErEQAAQBAJ&printsec=frontcover&img=1&zoom=0&source=gbs_api",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "6ace2ab1-2152-4847-b1ce-27f47b2291a0",
    title: "Think Again",
    author: "Adam Grant",
    isbn: "9781984878106",
    description: "The Power of Knowing What You Don't Know.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781984878106-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "6b50af8b-9604-43c4-a2b0-011346165bf8",
    title: "The Art of Seduction",
    author: "Robert Greene",
    isbn: "9780142001196",
    description: "The subtle art of getting what you want.",
    category: "Psychology",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780142001196-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "6eaad30e-26ea-4298-8cba-3a416d9d031d",
    title: "Range",
    author: "David Epstein",
    isbn: "9780735214484",
    description: "Why Generalists Triumph in a Specialized World.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735214484-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "70177470-4332-48c4-bbbf-7930719f000c",
    title: "The Psychology of Money",
    author: "Morgan Housel",
    isbn: "9780857197689",
    description: "Timeless lessons on wealth, greed, and happiness.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "73ff6ee6-eaf3-444c-b338-9704b108baf0",
    title: "Originals",
    author: "Adam Grant",
    isbn: "9780525429562",
    description: "How Non-Conformists Move the World.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525429562-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "75035bf1-22a6-4b13-b11b-dfb1afb34016",
    title: "The Mountain Is You",
    author: "Brianna Wiest",
    isbn: "9781949759228",
    description: "Transforming Self-Sabotage into Self-Mastery.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781949759228-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "764cff23-06db-4937-a3a3-dc09f28cc8c9",
    title: "Daring Greatly",
    author: "Brené Brown",
    isbn: "9781592408412",
    description: "How the Courage to Be Vulnerable Transforms the Way We Live.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781592408412-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "79d4ca49-f847-40d6-aec9-df4137d1a0bd",
    title: "Give and Take",
    author: "Adam Grant",
    isbn: "9780143124986",
    description: "Why Helping Others Drives Our Success.",
    category: "Psychology",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143124986-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "7a931a27-5a71-492f-a9c1-595c76634002",
    title: "Skin in the Game",
    author: "Nassim Nicholas Taleb",
    isbn: "9780425284629",
    description: "Hidden Asymmetries in Daily Life.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780425284629-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "7ad68ae9-691f-4aa8-940a-936d528bcc25",
    title: "Designing Your Life",
    author: "Bill Burnett",
    isbn: "9781101875322",
    description: "How to Build a Well-Lived, Joyful Life.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781101875322-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "7bdee0e8-a0ba-49f6-8e16-524a380a21e3",
    title: "Man's Search for Meaning",
    author: "Viktor E. Frankl",
    isbn: "9780807014271",
    description: "The classic tribute to hope from the Holocaust.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780807014271-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "7d07b4c0-d0dc-41e8-8a6f-24172b16d7f0",
    title: "The Hero with a Thousand Faces",
    author: "Joseph Campbell",
    isbn: "9781577315933",
    description: "The archetype of the hero's journey (deeply Jungian).",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781577315933-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "7ebe5576-fd61-4b19-933e-f7ab88ccc7da",
    title: "The Everything Store",
    author: "Brad Stone",
    isbn: "9780316219266",
    description: "Jeff Bezos and the Age of Amazon.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316219266-L.jpg",
    createdAt: "2026-01-18 20:07:02.272182+00"
  },
  {
    id: "7f1995f3-95f9-4a4d-b1de-f2557b820071",
    title: "Everything Is F*cked",
    author: "Mark Manson",
    isbn: "9780062888433",
    description: "A Book About Hope.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062888433-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "808c7082-903d-445a-a75a-5feea475f5c8",
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    isbn: "9780060555665",
    description: "The Definitive Book on Value Investing.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060555665-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "827af9da-1cf1-46d2-8ffc-eba0d64a4a4c",
    title: "The Lean Startup",
    author: "Eric Ries",
    isbn: "9780307887894",
    description: "How Today's Entrepreneurs Use Continuous Innovation.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780307887894-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "82a14ff1-5373-4f9d-b3f3-82483061431b",
    title: "Memories, Dreams, Reflections",
    author: "Carl G. Jung",
    isbn: "9780679723950",
    description: "Jung's autobiography and spiritual journey.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780679723950-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "844fc7fd-cca0-4ea0-b9d0-2ebd724a336a",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    isbn: "9781451648539",
    description: "The Exclusive Biography.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781451648539-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "845ea534-e368-440f-b094-3d9ab500ff53",
    title: "Homo Deus",
    author: "Yuval Noah Harari",
    isbn: "9780062464316",
    description: "A Brief History of Tomorrow.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062464316-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "8588bf55-9b8d-416f-a4a0-34886c02f9d5",
    title: "Atlas of the Heart",
    author: "Brené Brown",
    isbn: "9780399592553",
    description: "Mapping Meaningful Connection and the Language of Human Experience.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780399592553-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "8701fe01-1401-4e4b-b106-cbd49585736c",
    title: "Bad Blood",
    author: "John Carreyrou",
    isbn: "9781524731656",
    description: "Secrets and Lies in a Silicon Valley Startup.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781524731656-L.jpg",
    createdAt: "2026-01-18 20:07:02.272182+00"
  },
  {
    id: "876f7f0c-9c5b-4483-8872-4f663fde5ffe",
    title: "Ego Is the Enemy",
    author: "Ryan Holiday",
    isbn: "9781591847816",
    description: "The Fight to Master Our Greatest Opponent.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591847816-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "87c13e5f-4ca2-4fff-a32d-2fa5b16f0058",
    title: "21 Lessons for the 21st Century",
    author: "Yuval Noah Harari",
    isbn: "9780525512172",
    description: "A probing investigation into today's most urgent issues.",
    category: "History",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525512172-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "8943142d-3435-4526-a1ca-99e28703c952",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    isbn: "9780062316097",
    description: "A Brief History of Humankind.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "8a5849d6-43a8-4ba0-82a1-b112a10a2b50",
    title: "Fooled by Randomness",
    author: "Nassim Nicholas Taleb",
    isbn: "9781400067930",
    description: "The Hidden Role of Chance in Life and in the Markets.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781400067930-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "8e51fa94-8c0d-4fb3-a0d7-0a186e6ee166",
    title: "Essentialism",
    author: "Greg McKeown",
    isbn: "9780804137386",
    description: "The Disciplined Pursuit of Less.",
    category: "Productivity",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780804137386-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "8fd6f410-67b0-4b53-aa9e-37c3eaf904ff",
    title: "Limitless",
    author: "Jim Kwik",
    isbn: "9781401958237",
    description: "Upgrade Your Brain, Learn Anything Faster.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781401958237-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "9002366c-26ac-4a1d-b866-8b7049d93e75",
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    isbn: "9781612680194",
    description: "What the Rich Teach Their Kids About Money.",
    category: "Finance",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781612680194-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "96c87490-843c-4e43-923b-c4b7ab5a013d",
    title: "You Are a Badass",
    author: "Jen Sincero",
    isbn: "9780762447695",
    description: "How to Stop Doubting Your Greatness.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780762447695-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "9732ed32-fd2d-4ca7-88b7-084e87d270b7",
    title: "Awaken the Giant Within",
    author: "Tony Robbins",
    isbn: "9780671791544",
    description: "How to take immediate control of your mental destiny.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780671791544-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "984457c6-d018-4ada-ae15-865ad62be5d6",
    title: "So Good They Can't Ignore You",
    author: "Cal Newport",
    isbn: "9781455509126",
    description: "Why Skills Trump Passion in the Quest for Work You Love.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781455509126-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "9a00ac58-822b-4a53-9e95-8e20f9cfca49",
    title: "Your Money or Your Life",
    author: "Vicki Robin",
    isbn: "9780143115762",
    description: "9 Steps to Transforming Your Relationship with Money.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143115762-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "9aa5a090-9e1d-41fb-be5f-8aa3e6694f1d",
    title: "Effortless",
    author: "Greg McKeown",
    isbn: "9780593135648",
    description: "Make It Easier to Do What Matters Most.",
    category: "Productivity",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780593135648-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "9b8a4bdc-ecfd-46a6-85f4-4d3fe01ee903",
    title: "Same as Ever",
    author: "Morgan Housel",
    isbn: "9780593654439",
    description: "A Guide to What Never Changes.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780593654439-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "9bd19240-6e14-4c77-8bb9-278c1c098b34",
    title: "Discipline Is Destiny",
    author: "Ryan Holiday",
    isbn: "9780593191699",
    description: "The Power of Self-Control.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780593191699-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "9e7177c3-598a-40b7-89ce-4630811ceb35",
    title: "Stumbling on Happiness",
    author: "Daniel Gilbert",
    isbn: "9781400077427",
    description: "Why we are bad at predicting what will make us happy.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781400077427-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "a05d24e4-4f63-4b19-804e-b848649c7fbf",
    title: "Girl, Wash Your Face",
    author: "Rachel Hollis",
    isbn: "9781400201655",
    description: "Stop Believing the Lies About Who You Are.",
    category: "Personal Growth",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781400201655-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "a2d31e32-2ddf-4a4e-b17c-6dc9ceb12d5e",
    title: "Hooked",
    author: "Nir Eyal",
    isbn: "9781591847786",
    description: "How to Build Habit-Forming Products.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781591847786-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "a33e972e-92d7-4cda-9075-2d6809bfe998",
    title: "Life Force",
    author: "Tony Robbins",
    isbn: "9781501165887",
    description: "How New Breakthroughs in Precision Medicine Can Transform the Quality of Your Life.",
    category: "Health",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501165887-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "a658f7e7-2ce5-4310-8114-f91d70a97094",
    title: "12 Rules for Life",
    author: "Jordan B. Peterson",
    isbn: "9780345816023",
    description: "An Antidote to Chaos.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780345816023-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "aa615a39-848b-4adb-9f09-71026b242a5e",
    title: "The Body Keeps the Score",
    author: "Bessel van der Kolk",
    isbn: "9780143127741",
    description: "Brain, Mind, and Body in the Healing of Trauma.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143127741-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "b037e6d5-a53b-4db7-acfa-aa770d73bb19",
    title: "A Random Walk Down Wall Street",
    author: "Burton G. Malkiel",
    isbn: "9780393330335",
    description: "The Time-Tested Strategy for Successful Investing.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://books.google.com/books/content?id=v8ENTFP29tkC&printsec=frontcover&img=1&zoom=0&source=gbs_api",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "b20ba883-2c76-47f6-a8fe-2c1d1d6bb34b",
    title: "The Four Agreements",
    author: "Don Miguel Ruiz",
    isbn: "9781878424310",
    description: "A Practical Guide to Personal Freedom.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781878424310-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "b27c9325-d2e3-4785-bfe9-86f097254302",
    title: "Profit First",
    author: "Mike Michalowicz",
    isbn: "9780735214149",
    description: "Transform Your Business from a Cash-Eating Monster.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735214149-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "b5696495-5b83-497c-9da5-dffc638f2427",
    title: "The Big Short",
    author: "Michael Lewis",
    isbn: "9780393338829",
    description: "Inside the Doomsday Machine.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780393338829-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "b80a9b9c-4b01-4b53-9699-8fa5fe2b38a8",
    title: "Right Thing, Right Now",
    author: "Ryan Holiday",
    isbn: "9780593191712",
    description: "Good Values. Good Character. Good Deeds.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780593191712-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "ba08119e-6b13-4952-9cb3-7f5ea13af72b",
    title: "The 48 Laws of Power",
    author: "Robert Greene",
    isbn: "9780140280197",
    description: "Amoral, cunning, ruthless, and instructive.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780140280197-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "ba5b1406-79b8-4170-a85b-a067a48853b1",
    title: "The High 5 Habit",
    author: "Mel Robbins",
    isbn: "9781401962128",
    description: "Take Control of Your Life with One Simple Habit.",
    category: "Personal Growth",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781401962128-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "bb479122-97d8-4138-8b95-5958a590c157",
    title: "A Promised Land",
    author: "Barack Obama",
    isbn: "9781524763169",
    description: "A riveting, deeply personal account of history in the making.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781524763169-L.jpg",
    createdAt: "2026-01-18 19:27:26.029423+00"
  },
  {
    id: "bbe90e4d-bdb9-4968-afc5-b59813899f96",
    title: "Elon Musk",
    author: "Walter Isaacson",
    isbn: "9781982181284",
    description: "A Biography of the Tesla CEO.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781982181284-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00",
    isTrending: true
  },
  {
    id: "bd874d75-a895-4beb-b964-163076c459ca",
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    isbn: "9780062457714",
    description: "A Counterintuitive Approach to Living a Good Life.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://books.google.com/books/content?id=yng_CwAAQBAJ&printsec=frontcover&img=1&zoom=0&source=gbs_api",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "beb8b2cd-f71c-4dd4-9f35-70639bb904bd",
    title: "Braving the Wilderness",
    author: "Brené Brown",
    isbn: "9780812995848",
    description: "The Quest for True Belonging.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780812995848-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "c413e716-81b5-4707-8187-1b1e1074e6c7",
    title: "Man and His Symbols",
    author: "Carl G. Jung",
    isbn: "9780440351832",
    description: "An introduction to the unconscious mind.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780440351832-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "c4255e73-1435-4b1b-973c-8bb823a57b21",
    title: "Flash Boys",
    author: "Michael Lewis",
    isbn: "9780393244663",
    description: "A Wall Street Revolt.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780393244663-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "c4532f6f-2b42-42cd-ae2b-a3cb2580638f",
    title: "Can't Hurt Me",
    author: "David Goggins",
    isbn: "9781544512280",
    description: "Master Your Mind and Defy the Odds.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781544512280-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "c6baa149-91f1-4e93-b234-f6833cd3d352",
    title: "Beyond Order",
    author: "Jordan B. Peterson",
    isbn: "9780593084649",
    description: "12 More Rules for Life.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780593084649-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "c8cff8a1-b9b4-4ccc-a74c-a05612402f83",
    title: "Outliers",
    author: "Malcolm Gladwell",
    isbn: "9780316017930",
    description: "The Story of Success.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://books.google.com/books/content?id=_72pBQAAQBAJ&printsec=frontcover&img=1&zoom=0&source=gbs_api",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "c9430a30-821a-4350-81ad-668ccac1b229",
    title: "The Hard Thing About Hard Things",
    author: "Ben Horowitz",
    isbn: "9780062273208",
    description: "Building a Business When There Are No Easy Answers.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062273208-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "cd59fb1e-2b9e-4ce4-bf59-bdfa2e929662",
    title: "The Tao of Charlie Munger",
    author: "David Clark",
    isbn: "9781501168123",
    description: "A Compilation of Quotes from Berkshire Hathaway's Vice Chairman.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781501168123-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "cd6d4f7c-9f40-43a6-8b67-0fd65e7a06c2",
    title: "Seeking Wisdom",
    author: "Peter Bevelin",
    isbn: "9781578644285",
    description: "From Darwin to Munger - A Guide to Thinking.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781578644285-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "cd8b7eda-9a34-48a9-8ecf-27a705a38d5d",
    title: "Dare to Lead",
    author: "Brené Brown",
    isbn: "9780399592522",
    description: "Brave Work. Tough Conversations. Whole Hearts.",
    category: "Leadership",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780399592522-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "d176f4c0-12d4-42df-af04-01367c227e17",
    title: "Everything is Figureoutable",
    author: "Marie Forleo",
    isbn: "9780525534990",
    description: "One simple phrase can change your life.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://books.google.com/books/content?vid=ISBN9780525535010&printsec=frontcover&img=1&zoom=0&source=gbs_api",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "d2b9f366-b822-4777-8afe-47ba983bf187",
    title: "Broke Millennial",
    author: "Erin Lowry",
    isbn: "9780143130406",
    description: "Stop Scraping By and Get Your Financial Life Together.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143130406-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "d397a8ab-7a30-4980-a327-be90400b4d97",
    title: "The Gifts of Imperfection",
    author: "Brené Brown",
    isbn: "9781592858491",
    description: "Let Go of Who You Think You're Supposed to Be.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781592858491-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "d4784e6f-10b9-4168-ac9f-3465018bd040",
    title: "This Is Marketing",
    author: "Seth Godin",
    isbn: "9780525540830",
    description: "You Can't Be Seen Until You Learn to See.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525540830-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "d6afeb99-2ed2-4d46-8849-ddaee4ef9f60",
    title: "Secrets of the Millionaire Mind",
    author: "T. Harv Eker",
    isbn: "9780060763282",
    description: "Mastering the Inner Game of Wealth.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780060763282-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "d6dea3ef-b3eb-4dfb-b1ac-2eb1e8a111cc",
    title: "Courage Is Calling",
    author: "Ryan Holiday",
    isbn: "9780593191675",
    description: "Fortune Favors the Brave.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780593191675-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "d746e279-dde4-47b6-b7a1-d9a44b95ccba",
    title: "Blink",
    author: "Malcolm Gladwell",
    isbn: "9780316172325",
    description: "The Power of Thinking Without Thinking.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316172325-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "d7d706b3-3ffd-4554-8b63-bbc7e5630649",
    title: "Measure What Matters",
    author: "John Doerr",
    isbn: "9780525536222",
    description: "How Google, Bono, and the Gates Foundation Rock the World with OKRs.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780525536222-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "d94bf127-5812-4992-8a5a-6a06799f20f2",
    title: "Quit Like a Millionaire",
    author: "Kristy Shen",
    isbn: "9780143133643",
    description: "No Gimmicks, Luck, or Trust Fund Required.",
    category: "Finance",
    status: "BORROWED",
    borrowedBy: "user-external",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780143133643-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "da5a2b2d-bab1-4efb-b01a-423e15c227c7",
    title: "Zero to One",
    author: "Peter Thiel",
    isbn: "9780804139298",
    description: "Notes on Startups, or How to Build the Future.",
    category: "Business",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780804139298-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "dadaf546-38fa-4f10-8f6c-10c38c7f7b32",
    title: "The Infinite Game",
    author: "Simon Sinek",
    isbn: "9780735213500",
    description: "Business is not a finite game.",
    category: "Leadership",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735213500-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "dc31e61f-c929-4b40-b657-6d031c2d8f35",
    title: "Psychological Types",
    author: "Carl G. Jung",
    isbn: "9780691018133",
    description: "The origin of introversion, extraversion, and the functions.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780691018133-L.jpg",
    createdAt: "2026-01-18 19:23:03.123927+00"
  },
  {
    id: "dc9d3ef2-e0d1-4e00-bd1f-d347c80ecf0d",
    title: "Tribe of Mentors",
    author: "Tim Ferriss",
    isbn: "9781328994967",
    description: "Short Life Advice from the Best in the World.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781328994967-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "ddbb6d91-7b91-43e4-bbf9-52eb12d1c0da",
    title: "Make Your Bed",
    author: "William H. McRaven",
    isbn: "9781455570249",
    description: "Little Things That Can Change Your Life.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781455570249-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "dfd59a2d-efbd-4595-b77a-8a5e5bbc01b8",
    title: "Unfu*k Yourself",
    author: "Gary John Bishop",
    isbn: "9780062803832",
    description: "Get Out of Your Head and into Your Life.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780062803832-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "e4052d06-8c2b-42cf-a5c0-a225df47667b",
    title: "Daily Stoic",
    author: "Ryan Holiday",
    isbn: "9780735211735",
    description: "366 Meditations on Wisdom.",
    category: "Philosophy",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780735211735-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "e6187d1d-fd6c-449b-b4b1-c7d894aa60bf",
    title: "I Will Teach You to Be Rich",
    author: "Ramit Sethi",
    isbn: "9780761147480",
    description: "No Guilt. No Excuses. Just a 6-Week Program.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780761147480-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "e68fa1c7-e3e0-4a39-97b6-afe1ebd957fb",
    title: "Big Magic",
    author: "Elizabeth Gilbert",
    isbn: "9781594634727",
    description: "Creative Living Beyond Fear.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781594634727-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "e82d2688-d859-4ea5-ab12-4a637bdcf8a3",
    title: "The Simple Path to Wealth",
    author: "J.L. Collins",
    isbn: "9781533667922",
    description: "Your road map to financial independence.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781533667922-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "eadf97e7-2e47-44a8-a6ea-039222a7074a",
    title: "The Black Swan",
    author: "Nassim Nicholas Taleb",
    isbn: "9780812973815",
    description: "The Impact of the Highly Improbable.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780812973815-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "f0ac38b1-24e4-4ac9-acb9-286c4ba44aa4",
    title: "The Power of Now",
    author: "Eckhart Tolle",
    isbn: "9781577314806",
    description: "A Guide to Spiritual Enlightenment.",
    category: "Spirituality",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781577314806-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "f170edef-0614-485e-98e3-b262bb3b9827",
    title: "Influence",
    author: "Robert B. Cialdini",
    isbn: "9780061241895",
    description: "The Psychology of Persuasion.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780061241895-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "f3da5c60-1c35-48c2-b1e0-a033ea171947",
    title: "The Total Money Makeover",
    author: "Dave Ramsey",
    isbn: "9781595550781",
    description: "A Proven Plan for Financial Fitness.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9781595550781-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "f88396bf-4fcd-4940-a127-b16700d69165",
    title: "Just Keep Buying",
    author: "Nick Maggiulli",
    isbn: "9780857199256",
    description: "Proven ways to save money and build your wealth.",
    category: "Finance",
    status: "AVAILABLE",
    coverUrl: "https://books.google.com/books/content?id=JjEZEAAAQBAJ&printsec=frontcover&img=1&zoom=0&source=gbs_api",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "fb98111d-2115-493d-a02f-ac67862e38af",
    title: "Einstein",
    author: "Walter Isaacson",
    isbn: "9780743264730",
    description: "His Life and Universe.",
    category: "Biography",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780743264730-L.jpg",
    createdAt: "2026-01-18 19:19:47.370291+00"
  },
  {
    id: "fca16d42-b16d-47aa-b4d1-0dc5247e0472",
    title: "Why Has Nobody Told Me This Before?",
    author: "Dr. Julie Smith",
    isbn: "9780063227934",
    description: "Everyday Tools for Life's Ups and Downs.",
    category: "Personal Growth",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780063227934-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "fd2d2cad-c758-4ec4-89ae-f160ebc7c134",
    title: "Emotional Intelligence",
    author: "Daniel Goleman",
    isbn: "9780553383713",
    description: "Why It Can Matter More Than IQ.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780553383713-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  },
  {
    id: "feb5fc5c-e43f-4dcb-82a8-254e42d00490",
    title: "Talking to Strangers",
    author: "Malcolm Gladwell",
    isbn: "9780316478526",
    description: "What We Should Know about the People We Don't Know.",
    category: "Psychology",
    status: "AVAILABLE",
    coverUrl: "https://covers.openlibrary.org/b/isbn/9780316478526-L.jpg",
    createdAt: "2026-01-18 18:56:57.515059+00"
  }
];

export const mockDb = {
  getBooks: (): Book[] => {
    const stored = localStorage.getItem(STORAGE_KEY_BOOKS);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(CSV_BOOKS));
      return CSV_BOOKS;
    }
    return JSON.parse(stored);
  },
  
  getDeletedBooks: (): Book[] => {
    const stored = localStorage.getItem(STORAGE_KEY_DELETED_BOOKS);
    return stored ? JSON.parse(stored) : [];
  },

  addBook: (book: Book): Book => {
    const books = mockDb.getBooks();
    const newBooks = [book, ...books];
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(newBooks));
    return book;
  },

  updateBook: (updatedBook: Book): void => {
    const books = mockDb.getBooks();
    const newBooks = books.map(b => b.id === updatedBook.id ? updatedBook : b);
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(newBooks));
  },

  deleteBook: (id: string): void => {
    const books = mockDb.getBooks();
    const deletedBooks = mockDb.getDeletedBooks();
    const bookToDelete = books.find(b => b.id === id);
    
    if (!bookToDelete) return;

    const newBooks = books.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(newBooks));
    
    const newDeletedBooks = [bookToDelete, ...deletedBooks];
    localStorage.setItem(STORAGE_KEY_DELETED_BOOKS, JSON.stringify(newDeletedBooks));
  },

  deleteBooks: (ids: string[]): void => {
    const books = mockDb.getBooks();
    const deletedBooks = mockDb.getDeletedBooks();
    
    const booksToDelete = books.filter(b => ids.includes(b.id));
    const newBooks = books.filter(b => !ids.includes(b.id));

    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(newBooks));
    
    const newDeletedBooks = [...booksToDelete, ...deletedBooks];
    localStorage.setItem(STORAGE_KEY_DELETED_BOOKS, JSON.stringify(newDeletedBooks));
  },
  
  restoreBook: (id: string): void => {
    const deletedBooks = mockDb.getDeletedBooks();
    const books = mockDb.getBooks();
    const bookToRestore = deletedBooks.find(b => b.id === id);
    
    if (!bookToRestore) return;

    const newDeletedBooks = deletedBooks.filter(b => b.id !== id);
    localStorage.setItem(STORAGE_KEY_DELETED_BOOKS, JSON.stringify(newDeletedBooks));

    const newBooks = [bookToRestore, ...books];
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(newBooks));
  },

  restoreAllBooks: (): void => {
    const deletedBooks = mockDb.getDeletedBooks();
    const books = mockDb.getBooks();
    const newBooks = [...deletedBooks, ...books];
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(newBooks));
    localStorage.setItem(STORAGE_KEY_DELETED_BOOKS, JSON.stringify([]));
  },

  permanentlyDeleteBook: (id: string): void => {
      const deletedBooks = mockDb.getDeletedBooks();
      const newDeletedBooks = deletedBooks.filter(b => b.id !== id);
      localStorage.setItem(STORAGE_KEY_DELETED_BOOKS, JSON.stringify(newDeletedBooks));
  },

  login: (role: 'ADMIN' | 'USER'): User => {
    const storedUserStr = localStorage.getItem(STORAGE_KEY_USER);
    let existingUser: User | null = null;
    if (storedUserStr) {
        existingUser = JSON.parse(storedUserStr);
    }

    const user: User = {
      id: role === 'ADMIN' ? 'admin-001' : 'user-001',
      email: role === 'ADMIN' ? 'admin@libri.ai' : 'jane@libri.ai',
      name: role === 'ADMIN' ? 'Admin User' : 'Jane Doe',
      role: role,
      interestedBookIds: (existingUser && existingUser.role === role) ? existingUser.interestedBookIds : []
    };
    
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(STORAGE_KEY_USER);
    return stored ? JSON.parse(stored) : null;
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEY_USER);
  },

  toggleInterest: (bookId: string): User | null => {
      const user = mockDb.getCurrentUser();
      if (!user) return null;

      const isInterested = user.interestedBookIds.includes(bookId);
      let newInterests;
      
      if (isInterested) {
          newInterests = user.interestedBookIds.filter(id => id !== bookId);
      } else {
          newInterests = [...user.interestedBookIds, bookId];
      }

      const updatedUser = { ...user, interestedBookIds: newInterests };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
      return updatedUser;
  },

  borrowBook: (bookId: string, userId: string): { success: boolean, user: User } => {
    const books = mockDb.getBooks();
    let user = mockDb.getCurrentUser();
    if (!user) return { success: false, user: user! };

    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1 || books[bookIndex].status !== 'AVAILABLE') {
      return { success: false, user };
    }

    books[bookIndex] = {
      ...books[bookIndex],
      status: 'BORROWED',
      borrowedBy: userId
    };
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));

    if (user.interestedBookIds.includes(bookId)) {
        user = {
            ...user,
            interestedBookIds: user.interestedBookIds.filter(id => id !== bookId)
        };
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    }

    return { success: true, user };
  },

  returnBook: (bookId: string): boolean => {
    const books = mockDb.getBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    
    if (bookIndex === -1) return false;

    books[bookIndex] = {
      ...books[bookIndex],
      status: 'AVAILABLE',
      borrowedBy: null
    };
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
    return true;
  },

  // --- SCRIPT TO ENRICH COVERS ---
  // Iterates through books, finds placeholders, calls Google Books API, and updates them.
  refreshCovers: async (): Promise<boolean> => {
    const books = mockDb.getBooks();
    let hasUpdates = false;
    
    // Helper to process a batch
    const processBatch = async (batch: Book[]) => {
        const promises = batch.map(async (book) => {
            // Skip if not a placeholder
            if (!book.coverUrl.includes('placehold.co')) return null;
            if (!book.isbn) return null;

            const newUrl = await getGoogleBookCover(book.isbn);
            if (newUrl) {
                return { id: book.id, url: newUrl };
            }
            return null;
        });
        return Promise.all(promises);
    };

    // Process in batches of 5 to avoid rate limits
    const BATCH_SIZE = 5;
    const updates = new Map<string, string>();

    // Scan all books
    const placeholderBooks = books.filter(b => b.coverUrl.includes('placehold.co') && b.isbn);
    
    if (placeholderBooks.length === 0) return false;

    // Process only the books that need updates
    for (let i = 0; i < placeholderBooks.length; i += BATCH_SIZE) {
        const batch = placeholderBooks.slice(i, i + BATCH_SIZE);
        const results = await processBatch(batch);
        results.forEach(res => {
            if (res) updates.set(res.id, res.url);
        });
        // Small delay between batches to be polite to the API
        await new Promise(r => setTimeout(r, 200));
    }

    if (updates.size > 0) {
        const updatedBooks = books.map(b => 
            updates.has(b.id) ? { ...b, coverUrl: updates.get(b.id)! } : b
        );
        localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(updatedBooks));
        hasUpdates = true;
    }
    
    return hasUpdates;
  }
};
