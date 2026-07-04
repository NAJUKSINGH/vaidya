import {DataAPIClient} from  "@datastax/astra-db-ts";

import {puppeteerWebBaseLoader} from "langchain/document_loaders/web/puppeteer";

import {recursiveCharacterTextSplitter} from "langchain/text_splitter";

import { GoogleGenAI } from "@google/genai";

import "dotenv/config";

const { ASTRA_DB_NAMESPACE, ASTRA_DB_COLLECTION, ASTRA_DB_API_ENDPOINT, ASTRA_DB_APPLICATION_TOKEN, GEMINI_API_KEY } = process.env;

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const f1Data = [

]

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN)
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE});