export type DefinitionSubject = { subjectName: string; sections: DefinitionSection[] };
export type DefinitionSection = { name: string; entries: DefinitionEntry[] };
export type DefinitionEntry = { prompt: string; response: string };

export const parseDefinitionDocument = (documentText: string, subjectName: string): DefinitionSubject => {
  const lines = documentText
    .split(`\n`)
    .map((x) => x.trim())
    .filter((x) => x);
  const sections = [] as DefinitionSection[];
  sections.push({ name: `[Start]`, entries: [] });
  let section = sections[0];

  for (const l of lines) {
    const parts = l.split(`\t`);
    // console.log(`line`, { l, parts });
    if (parts.length === 1) {
      sections.push({ name: parts[0].trim(), entries: [] });
      section = sections[sections.length - 1];
    }
    if (parts.length >= 2) {
      section.entries.push({ prompt: parts[0].trim(), response: parts[1].trim() });
    }
  }

  // Remove duplicates
  sections.forEach((s) => {
    s.entries = [...new Map(s.entries.map((x) => [x.prompt, x])).values()];
  });

  const sectionsCleaned = sections.filter((x) => x.entries.length > 0);
  return { subjectName, sections: sectionsCleaned };
};
