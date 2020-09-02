import React from 'react';
import { EducationalGame_StarBlastSideways } from '../star-blast-sideways';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { createSpanishProblemService } from '../problems/definition-spanish';

export const EducationalGame_StarBlastSideways_Spanish = (props: {}) => {
    return <EducationalGame_StarBlastSideways problemService={createReviewProblemService(createSpanishProblemService(), {})} />;
};
