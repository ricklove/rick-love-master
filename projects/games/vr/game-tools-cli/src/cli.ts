import { parseSimFiles } from './simfiles/simfiles';

export const run = async () => {
  // const args = process.argv.slice(2);
  // console.log(`hello!`, { placeholder, args });

  const simfileService = parseSimFiles(`../vr-test/public/ddr/`);
  console.log(simfileService);
};

// eslint-disable-next-line no-void
void run().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
