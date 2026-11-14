import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

const POEM = `The Last Meter

At dawn, the agent found a train
to the town I kept calling later.
It compared fares, chose a seat,
and placed the ticket in my inbox.

It could not know the kitchen light
left on above my sister's door,
or why one sentence, unsaid,
had grown heavier than the years.

I nearly let the train depart.
Then I put my shoes on.

It could get me to her street.
It could not make me knock.
`;

function main() {
  const charCount = Array.from(POEM).length;

  // Gate check: 1 to 1000 characters and not only whitespace
  if (charCount < 1 || charCount > 1000 || POEM.trim().length === 0) {
    console.error(`Validation failed: poem length is ${charCount} and non-whitespace check failed.`);
    process.exit(1);
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, 'entry.txt');
  fs.writeFileSync(outputPath, POEM, 'utf-8');

  // Verify file written correctly by reading back
  const writtenContent = fs.readFileSync(outputPath, 'utf-8');
  if (writtenContent !== POEM) {
    console.error('Error: Written content does not match source poem!');
    process.exit(1);
  }

  const stats = fs.statSync(outputPath);
  const hash = crypto.createHash('sha256').update(writtenContent).digest('hex');

  console.log(`Wrote entry to ${outputPath}`);
  console.log(`Bytes: ${stats.size}`);
  console.log(`Characters: ${charCount}`);
  console.log(`SHA256: ${hash}`);

  if (charCount !== 399) {
    console.error(`Warning: character count is ${charCount}, expected 399`);
    process.exit(1);
  }

  process.exit(0);
}

main();
