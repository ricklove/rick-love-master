import React from 'react';
import { EducationalGame_StarBlastSideways } from '../star-blast-sideways';
import { createReviewProblemService } from '../problems/problems-reviewer';
import { createSpellingProblemService } from '../problems/spelling/spelling-problem-service';

export const EducationalGame_StarBlastSideways_Spelling = (props: {}) => {
    return <EducationalGame_StarBlastSideways problemService={createReviewProblemService(createSpellingProblemService({}), {})} />;
};
