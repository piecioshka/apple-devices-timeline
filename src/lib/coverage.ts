import { devices } from '@/data/devices';
import { yearRange, type YearRange } from '@/lib/timeline';

const range = yearRange(devices);
if (!range) throw new Error('The device list is empty');

/**
 * First and last announcement years in the dataset. The page description,
 * the share images and the Instagram story quote them.
 */
export const coverage: YearRange = range;
