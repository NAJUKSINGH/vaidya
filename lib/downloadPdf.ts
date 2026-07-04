import fs from "fs";
import path from "path";
import axios from "axios";

export async function downloadPdf(url: string) {
    console.log("Downloading:", url);
    try {
        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });
        console.log(response.headers["content-type"]);

        const filePath = path.join(process.cwd(), "temp.pdf");

        fs.writeFileSync(filePath, response.data);

        return filePath;
    } catch (error) {
        console.error("PDF Download Error:", error);
        throw error;
    }
}