import './fetch-polyfill';
import fs from 'fs/promises';
import { scrapeEntries } from './scrape-entries';

// eslint-disable-next-line no-void
void scrapeEntries({ fs });
