import { bookMap } from "@/constants/bookMap";
import { youVersionBookMap } from "@/constants/yourVersionBookMap";

export function getBibleUrl(ref: string){
  const cleanedRef = ref.trim();
  const lastSpaceIndex = cleanedRef.lastIndexOf(' ');

  if (lastSpaceIndex === -1) {
    return { appUrl: '#', webUrl: "#", bibleGateway: "#"};
  }

  const bookAbbr = cleanedRef.substring(0, lastSpaceIndex);
  const versePart = cleanedRef.substring(lastSpaceIndex + 1);

  if (!/^\d/.test(versePart)) {
      return '#';
  }

  const fullBook = bookMap[bookAbbr] || bookAbbr;
  const youVersionBook = youVersionBookMap[bookAbbr]
  const normalizedVerse = versePart.replace(".",":");
  
  return {
    appUrl: youVersionBook
      ? `youversion://bible/212/${youVersionBook}.${normalizedVerse}`
      : "#",

    webUrl: youVersionBook
      ? `https://www.bible.com/bible/212/${youVersionBook}.${normalizedVerse}.ARC`
      : "#",

    bibleGateway: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
    `${fullBook} ${normalizedVerse}`
    )}&version=ARC`,
  };  
}
