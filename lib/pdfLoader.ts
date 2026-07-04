import fs from "fs";

const pdf = require("pdf-parse");

console.log("PDF IMPORT:", pdf);
console.log("TYPE:", typeof pdf);

export async function loadPdf(filePath: string) {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);

        return data.text;
    } catch (error) {
        console.error("PDF Loader Error:", error);
        return "";
    }
}