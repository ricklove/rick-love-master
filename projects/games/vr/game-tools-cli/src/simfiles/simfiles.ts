import { promises as fs } from 'fs';
import { relative, resolve } from 'path';
import { parseAllPacks } from 'simfile-parser';

/**

https://github.com/stepmania/stepmania/wiki/sm#notes
https://github.com/stepmania/stepmania/wiki/Note-Types

There are multiple **note types** available in StepMania.

The total number of beats covered by any given measure is 4

| Note Type | Key Symbol | Comments |
| --- | --- | --- |
| Tap | 1 | Standard note type |
| Hold Head | 2 | Tap the hold note (as charged note on beat, frezze arrows on dance, etc.) when it crosses the judgment row, then hold it down. Note: Releasing the key during hold note in some themes breaks your combo. |
| Hold/Roll End | 3 | You can let go of the hold when the end crosses the judgment row. |
| Roll Head | 4 | Tap the roll note when it crosses the judgment row, then hit repeatly it until the end. |
| Mine | M | Do not tap the negative notes (as mines, shock arrows, etc.) when it crosses or have your foot held down when it crosses. You will lose life and in some themes breaks your combo! |
| Lift | L | Have your foot on the arrow before it crosses. Lift up when it does cross. |
| Fake | F | You can ignore this note: it does nothing for or against you. |
| AutoKeysound | K | This 'note' is not really a note, it marks a keysound that will play automatically at this row. No note will appear here, and this is only used for empty rows. |

 */
export type SimFileNotes = {};

export enum SimFileNoteKind {
  Tap_1 = `T`,
  HoldHead_2 = `S`,
  HoldRollEnd_3 = `E`,
  RollHead_4 = `R`,
  Mine_M = `M`,
  Lift_L = `L`,
  Fake_F = `F`,
  AutoKeysound_K = `K`,
  Freeze = `Z`,
  Unknown = `U`,
}

export const getMusicFileName = async (
  rootPath: string,
  packDirName: string,
  titleDirName: string,
  titleName: string,
) => {
  // check if .ogg file exists

  const ext = [`.ogg`, `.mp3`, ` .ogg`, ` .mp3`];

  // D:\Projects\rick-love-master\projects\games\vr\vr-test\public\vr-test\public\ddr\pack_1427_941f54\1st Samurai\1st Samurai.mp3
  // D:\Projects\rick-love-master\projects\games\vr\vr-test\public\ddr\pack_1427_941f54\1st Samurai\1st Samurai.mp3

  for (const e of ext) {
    try {
      const fileName = titleDirName + e;
      const filePath = resolve(rootPath, packDirName, titleDirName, fileName).replace(/\\/g, `/`);
      // console.log(`Checking for music file: ${filePath}`);

      await fs.access(filePath);
      return fileName;
    } catch (error) {
      continue;
    }
  }

  const filePath = resolve(rootPath, packDirName, titleDirName, titleName).replace(/\\/g, `/`);
  console.log(`Could not find music file for ${titleName} in ${titleDirName}: ${filePath}`);
  return undefined;
};

export const parseAndSaveSimFileGameData = async (rootPath: string) => {
  const allPacks = parseAllPacks(rootPath);

  const simplifiedPacks = await Promise.all(
    allPacks.map(async (pack) => {
      const { simfiles, name, dir } = pack;
      const packDirName = relative(rootPath, dir).replace(/\\/g, `/`);
      const packDirAbs = resolve(rootPath, packDirName);
      return {
        name,
        packDirName,
        songs: await Promise.all(
          simfiles.map(async (simfile) => {
            const { title, artist, availableTypes, charts, displayBpm } = simfile;

            const titleDirName = relative(packDirAbs, title.titleDir).replace(/\\/g, `/`);
            const titleName = title.titleName;
            const musicFileName = await getMusicFileName(rootPath, packDirName, titleDirName, titleName);

            return {
              packDirName,
              titleDirName,
              title: titleName,
              musicFileName,
              jacketImageFileName: title.jacket,
              artist,
              displayBpm: displayBpm,
              availableTypes: availableTypes.map((type) => ({
                slug: type.slug,
                mode: type.mode,
                difficulty: type.difficulty,
                meter: type.feet,
              })),
              charts: Object.entries(charts).map(([difficulty, chart]) => {
                const { bpm: bpmRanges, arrows, freezes, stops } = chart;

                const stopDurations = stops
                  .map((x) => ({
                    beat: x.offset * 4,
                    durationTime: x.duration,
                  }))
                  .filter((x) => x.beat > 0 && x.durationTime && x.durationTime > 0);

                const calculateTime = (offset: number) => {
                  let time = 0;
                  for (const bpm of bpmRanges) {
                    // 4 beats per offset
                    const beatsPerSec = bpm.bpm / 60;
                    const secsPerOffset = 4 / beatsPerSec;

                    const startOffset = Math.max(0, bpm.startOffset);
                    if (!bpm.endOffset || offset < bpm.endOffset) {
                      time += (offset - startOffset) * secsPerOffset;
                      break;
                    }

                    time += (bpm.endOffset - startOffset) * secsPerOffset;
                  }

                  return time;
                };

                const getKind = (directionChar: string) => {
                  switch (directionChar) {
                    case `1`:
                      return SimFileNoteKind.Tap_1;
                    case `2`:
                      return SimFileNoteKind.HoldHead_2;
                    case `3`:
                      return SimFileNoteKind.HoldRollEnd_3;
                    case `4`:
                      return SimFileNoteKind.RollHead_4;
                    case `M`:
                      return SimFileNoteKind.Mine_M;
                    case `L`:
                      return SimFileNoteKind.Lift_L;
                    case `F`:
                      return SimFileNoteKind.Fake_F;
                    case `K`:
                      return SimFileNoteKind.AutoKeysound_K;
                    case `Z`:
                      return SimFileNoteKind.Freeze;
                    default:
                      console.error(`Unknown direction char: ${directionChar}`);
                      return SimFileNoteKind.Unknown;
                  }
                };

                const getPosition = (position: number) => {
                  return position.toString(16).toLowerCase();
                };

                const arrowsA = arrows
                  .filter((x) => !(x.direction as string).startsWith(`/`))
                  .map((x) => ({
                    positions: x.direction
                      .split(``)
                      .map((x, i) => {
                        if (x === `0`) {
                          return;
                        }
                        return {
                          kind: getKind(x),
                          position: i,
                        };
                      })
                      .filter((x) => x)
                      .map((x) => x!)
                      .filter((x) => x.kind !== SimFileNoteKind.HoldHead_2),
                    beat: x.offset * 4,
                    duration: 0,
                  }))
                  .filter((x) => x.positions.length);

                const notesA = [
                  ...arrowsA,
                  ...freezes.map((x) => ({
                    positions: [{ kind: SimFileNoteKind.Freeze, position: x.direction }],
                    beat: x.startOffset * 4,
                    duration: (x.endOffset - x.startOffset) * 4,
                  })),
                ].sort((a, b) => a.beat - b.beat);

                const notesB = notesA.map((x, i) => {
                  const prevBeat = notesA[i - 1]?.beat ?? -1;
                  const beatGap = x.beat - prevBeat;
                  return {
                    ...x,
                    beatGap,
                    timeStart: calculateTime(x.beat / 4),
                  };
                });

                const notesC = notesB.filter((x) => x.positions.length);
                const notesFinal = notesC.filter((x) => x.positions.length).sort((a, b) => a.beat - b.beat);

                const notesCode = notesFinal
                  .map((x) => {
                    const { beatGap, positions } = x;
                    const timingCode = beatGap === 1 ? `` : `@${beatGap}`;
                    const durationCode = x.duration <= 1 ? `` : `>${x.duration}`;
                    const debugCode = ``; //`[@${x.beat}]`;

                    const notesCode = positions
                      .map((x) => `${getPosition(x.position)}${x.kind === SimFileNoteKind.Tap_1 ? `` : x.kind}`)
                      .join(``);
                    return `${notesCode}${timingCode}${durationCode}${debugCode}`;
                  })
                  .join(` `);

                return {
                  difficulty,
                  bpmRanges: bpmRanges.map((x) => ({
                    bpm: x.bpm,
                    startBeat: Math.max(0, x.startOffset) * 4,
                    endBeat: (x.endOffset ?? 0) * 4 || undefined,
                    startTime: calculateTime(Math.max(0, x.startOffset)),
                    endTime: calculateTime(x.endOffset ?? 0) || undefined,
                  })),
                  finalBeatTime: calculateTime(
                    (notesC[notesC.length - 1].beat + notesC[notesC.length - 1].duration) / 4,
                  ),
                  stops: stopDurations,
                  notesCode: notesCode,
                  // TODO: remove this and parse notesCode
                  notes: notesFinal,

                  // arrows: arrows.map((arrow) => ({
                  //   position: arrow.direction.replace(/0/g, `.`),
                  //   time: calculateTime(arrow.offset),
                  //   offset: arrow.offset,
                  //   quantization: arrow.quantization,
                  // })),
                  // freezes: freezes.map((freeze) => ({
                  //   position: freeze.direction,
                  //   startOffset: freeze.startOffset,
                  //   endOffset: freeze.endOffset,
                  //   timeStart: calculateTime(freeze.startOffset),
                  //   timeEnd: calculateTime(freeze.endOffset),
                  // })),
                };
              }),
            };
          }),
        ),
      };
    }),
  );

  const outPath = rootPath;
  // const outPath = `./out`;
  await fs.mkdir(outPath, { recursive: true });

  for (const pack of simplifiedPacks) {
    for (const song of pack.songs) {
      await fs.mkdir(resolve(outPath, song.packDirName, song.titleDirName), { recursive: true });
      await fs.writeFile(
        resolve(outPath, song.packDirName, song.titleDirName, `game-data.json`),
        JSON.stringify(song, null, 2),
      );
    }
  }

  const indexObj = simplifiedPacks.map((x) => ({
    pack: x.name,
    songs: x.songs.map((x) => ({
      title: x.title,
      titleDir: x.titleDirName,
      musicFileName: x.musicFileName,
      artist: x.artist,
      image: x.jacketImageFileName,
      displayBpm: x.displayBpm,
      minMeter: Math.min(...x.availableTypes.map((x) => x.meter)),
      maxMeter: Math.max(...x.availableTypes.map((x) => x.meter)),
      difficulties: x.charts.map((x) => x.difficulty),
    })),
  }));

  await fs.writeFile(resolve(outPath, `game-data-index.json`), JSON.stringify(indexObj, null, 2));
};
