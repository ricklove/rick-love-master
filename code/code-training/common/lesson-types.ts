// Note: These types are optimized for runtime (shared immutable objects - not for json serialization)

export type LessonSeries = {
    lessons: LessonData[];
    seriesTitle: string;
};

export type LessonData = {
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
}
export type LessonExperimentReplacement = {
    filePath: string;
    content: string;
};

export type LessonProjectState = {
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
