import "dotenv/config";

import { createCollection } from "../lib/astra";
import { loadData } from "../lib/rag";
const companyUrls = [
    "https://patanjaliwellness.com/panchakarma.php",
    "LOCAL_PDF:data/ayurveda.pdf",
    "LOCAL_PDF:data/Ayurvedic-Home-Remedies-English.pdf",
    "https://ayurveda.com/resources/what-is-ayurveda/",
    "https://ayurveda.com/resources/ayurveda-doshas-guide/",
    "https://ayurveda.com/resources/what-is-vata-dosha/",
    "https://ayurveda.com/resources/what-is-pitta-dosha/",
    "https://ayurveda.com/resources/what-is-kapha-dosha/",
    "https://ayurveda.com/resources/what-is-Prakriti/",
    "https://ayurveda.com/resources/what-is-Vikruti/",
    "https://ayurveda.com/resources/ayurvedic-diet-guide/",
    "https://ayurveda.com/food-guidelines/",
    "https://ayurveda.com/resources/what-is-marma-therapy/",
    "https://ayurveda.com/resources/ayurvedic-pulse-reading-guide/",
    "https://www.webmd.com/balance/ss/slideshow-home-remedies"
];

async function main() {
    try {
        await createCollection();
        await loadData(companyUrls);

        console.log("Data loading complete.");
    } catch (error) {
        console.error(error);
    }
}

main();