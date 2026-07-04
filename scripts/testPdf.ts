import { loadPdf } from "../lib/pdfLoader";

async function main() {
    const text = await loadPdf("./data/ayurveda.pdf");

    console.log("TEXT LENGTH:", text.length);
    console.log(text.slice(0, 500));
}

main();