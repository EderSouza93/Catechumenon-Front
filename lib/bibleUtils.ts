import { bookMap } from "@/constants/bookMap";

/**
 * Remove acentos, espaços e deixa em minúsculas.
 * Exemplo: "Gênesis" -> "genesis" 
 */
function normalizeBookName(name: string) {
    return name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "")
}

/**
 * Gera a URL interna para consumir a rota `/api/bible`
 * que, por sua vez, chama a API externa bible-api.com.
 * 
 * @param ref Exemplo: "Jo 3.16", "Jd 1"
 * @returns string URL pronta para a chamada à API
 */
export function getBibleApiUrl(ref: string) {
    const cleanedRef = ref.trim();
    const lastSpaceIndex = cleanedRef.lastIndexOf(" ");

    if (lastSpaceIndex === -1) {
        return "/api/bible?reference=";
    }

    const bookAbbr = cleanedRef.substring(0, lastSpaceIndex);
    const versePart = cleanedRef.substring(lastSpaceIndex + 1);

    const fullBook = bookMap[bookAbbr] || bookAbbr;
    const nomalizedBook = normalizeBookName(fullBook);
    const normalizedVerse = versePart.replace(".", ":");
    const reference = `${nomalizedBook}${normalizedVerse}`;

    const singleChapterBooks = ["obadias", "filemon", "judas", "2joao", "3joao"];
    const isSingleChapterBook = singleChapterBooks.includes(nomalizedBook);

    let url = `/api/bible?reference=${encodeURIComponent(reference)}`;
    if (isSingleChapterBook) {
        url += "&single_chapter=true";
    }

    return url;
}