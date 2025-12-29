export const ambientSoundFiles = `
217741__erh__eerie-ph1-2o2c-13-7.ogg
217742__erh__eerie-ph1-2o2c-13-6.ogg
261032__erh__string-cbn2-b1-2.ogg
33836__erh__n-f-orchestral-4f.ogg
33837__erh__n-f-orchestral-f.ogg
33838__erh__negative-future-edit-1f.ogg
33839__erh__negative-future-edit-4.ogg
33887__erh__n-f-orchestral-2f.ogg
33888__erh__negative-future-edit-2.ogg
33987__erh__slow-atmosphere-4.ogg
34012__erh__cinematic-deep-bass-rumble.ogg
34013__erh__discordant-voices-ew54b-2.ogg
34014__erh__discordant-voices-ew54b-3.ogg
34015__erh__discordant-voices-ew54b-4.ogg
34016__erh__voices-ew54.ogg
34139__erh__discordant-voices-ew54b-5f.ogg
34140__erh__discordant-voices-ew54b.ogg
34141__erh__swell-pad.ogg
34186__erh__deep-bass-rumble-2.ogg
34187__erh__deep-bass-rumble-3.ogg
34338__erh__wind.ogg
34344__erh__voices-ew54-2.ogg
34345__erh__voices-ew54b.ogg
34377__erh__discordant-voices-ew54b-6.ogg
34384__erh__nine-lies-the-heart-ed-2.ogg
34421__erh__nine-lies-the-heart-ed-3.ogg
34588__erh__nine-lies-the-heart-ed-1.ogg
34662__erh__nine-lies-the-heart-ed-4.ogg
34663__erh__reverbbells.ogg
35615__erh__atmosphere-6-74.ogg
35898__erh__nine-lies-the-heart-ed-5.ogg
36319__erh__crescendo-b8-17.ogg
36320__erh__ominous-b.ogg
37224__erh__slow-atmosphere-5.ogg
37403__erh__storm-distortion.ogg
37551__erh__o-space-pad-2ec.ogg
37740__erh__synth-horizons.ogg
38368__erh__megs-storm.ogg
38543__erh__emergency-1.ogg
38544__erh__rhythm-22-own-b7-21.ogg
38680__erh__gong-30.ogg
38681__erh__owl-10.ogg
39224__erh__ew-46-rumble.ogg
40165__erh__o-space-pad-2e.ogg
40724__erh__erh-drone-wind.ogg
42102__erh__p12-o-2b-b9-15-stormy.ogg
42124__erh__p12-o-2b-b9-63-enig-retry.ogg
42285__erh__p-b8-112-long.ogg
42286__erh__f-eh-angelic-3.ogg
42332__erh__p-b8-105-huge-aec.ogg
42369__erh__p-b8-56-tappa.ogg
`
  .split(`\n`)
  .filter((x) => !!x)
  .map((x) => `./sounds/ambient/ogg/${x}`);

export const popSoundFiles = `
pop1.ogg
pop10.ogg
pop2.ogg
pop3.ogg
pop4.ogg
pop5.ogg
pop6.ogg
pop7.ogg
pop8.ogg
pop9.ogg
`
  .split(`\n`)
  .filter((x) => !!x)
  .map((x) => `./sounds/pop/${x}`);

export const creatureSoundFiles = `
179309__martian__cute-creature-look-out.ogg
469066__hawkeye_sprout__cute-creature-01.ogg
469067__hawkeye_sprout__cute-creature-02.ogg
469091__hawkeye_sprout__cute-creature-humming.ogg
  `
  .split(`\n`)
  .filter((x) => !!x)
  .map((x) => `./sounds/creature/${x}`);
