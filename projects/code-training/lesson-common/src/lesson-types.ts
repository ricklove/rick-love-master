// Note: These types are optimized for runtime (shared immutable objects - not for json serialization)

export type LessonModule = {
  key: string;
  title: string;
  lessons: LessonData[];
};

export type LessonData = {
  key: string;

  /** State of all code files in the project */
  projectState: LessonProjectState;
  // projectState_previous?: LessonProjectState;

  /** Code in Focus */
  focus: LessonProjectFileSelection;

  /** Lesson Title */
  title: string;
  /** Purpose */
  objective: string;
  /** Reason */
  explanation: string;
  /** Command
   *
   * Instruct the student what to type
   */
  task: string;
  /** Statements describing parts of the code in focus
   *
   * These will become fill in the blank problems
   */
  descriptions: string[];
  /** Allow swapping part of the code */
  experiments: LessonExperiment[];
};
export type LessonExperiment = {
  /** Multiple replacements may be required to implement an experiment. */
  replacements: LessonExperimentReplacement[];
  comment?: string;
  filesHashCode: LessonProjectStateFilesHashCode;
};
export type LessonExperimentReplacement = {
  selection: LessonProjectFileSelection;
  content: string;
};

export type LessonProjectStateFilesHashCode = string & { _type: 'LessonProjectStateFilesHashCode' };
export type LessonProjectState = {
  filesHashCode: LessonProjectStateFilesHashCode;
  files: LessonProjectFile[];
};

export type LessonProjectFile = {
  path: string;
  content: string;
  language: 'tsx';
};

export type LessonProjectFileSelection = {
  filePath: string;
  index: number;
  length: number;
};

// Lesson Steps
export type LessonStep_ConstructCode = {
  lessonData: LessonData;
};
export type LessonStep_UnderstandCode = {
  lessonData: LessonData;
};

export type SetProjectState = (projectState: LessonProjectState) => Promise<{ iFrameUrl: string }>;
