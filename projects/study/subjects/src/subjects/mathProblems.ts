import { StudyProblemBase, StudySubject } from '../types';

const MAX_MULTIPLICATION = 12;

/** For division, question: product / a = b */
type MathProblemOperator = '*' | '+' | '-' | '/' | '^';
const mathCategories = [
  { categoryKey: `+`, categoryTitle: `Addition` },
  { categoryKey: `-`, categoryTitle: `Subtraction` },
  { categoryKey: `*`, categoryTitle: `Multiplication` },
  { categoryKey: `/`, categoryTitle: `Division` },
  { categoryKey: `^`, categoryTitle: `Powers` },
];

export type MathProblemType = StudyProblemBase<'math'> & {
  key: string;
  subjectTitle: string;
  question: string;
  questionPreview: string;
  questionPreviewTimeMs: number;
  a: number;
  b: number;
  operator: MathProblemOperator;
  correctAnswer: string;
  correctAnswerValue: number;
  correctAnswerStatement: string;
};

const getFormTitle = (operator: MathProblemOperator): string => {
  switch (operator) {
    case `*`:
      return `Multiplication`;
    case `/`:
      return `Division`;
    case `-`:
      return `Subtraction`;
    case `+`:
      return `Addition`;
    case `^`:
      return `Powers`;
    default:
      return `Math`;
  }
};

const calculateAnswer = ({ x, y, operator }: { x: number; y: number; operator: MathProblemOperator }): number => {
  switch (operator) {
    case `*`:
      return x * y;
    case `/`:
      return x / y;
    case `-`:
      return x - y;
    case `+`:
      return x + y;
    case `^`:
      return Math.pow(x, y);
    default:
      return 0;
  }
};

const calculateProblem = ({
  x,
  y,
  operator,
}: {
  x: number;
  y: number;
  operator: MathProblemOperator;
}): MathProblemType => {
  const subjectTitle = getFormTitle(operator);

  if (operator === `/`) {
    // product / a = b

    if (x === 0) {
      x = 1;
    }
    const product = calculateAnswer({ x, y, operator: `*` });

    const key = `${product} ${operator} ${x}`;
    const question = `What is ${product} ${operator} ${x}?`;
    const correctAnswer = calculateAnswer({ x: product, y: x, operator });
    const correctAnswerStatement = `${product} / ${x} = ${y}`;

    return {
      subjectKey: `math`,
      categoryKey: operator,
      key,
      subjectTitle: subjectTitle,
      question,
      questionPreview: question,
      questionPreviewTimeMs: 1000,
      a: x,
      b: y,
      operator,
      correctAnswer: correctAnswer + ``,
      correctAnswerValue: correctAnswer,
      correctAnswerStatement,
    };
  }

  const key = `${x} ${operator} ${y}`;
  const question = `What is ${x} ${operator} ${y}?`;
  const correctAnswer = calculateAnswer({ x, y, operator });
  const correctAnswerStatement = `${x} ${operator} ${y} = ${correctAnswer}`;

  return {
    subjectKey: `math`,
    categoryKey: operator,
    key,
    subjectTitle: subjectTitle,
    question,
    questionPreview: question,
    questionPreviewTimeMs: 1000,
    a: x,
    b: y,
    operator,
    correctAnswer: correctAnswer + ``,
    correctAnswerValue: correctAnswer,
    correctAnswerStatement,
  };
};

const operatorChances = [
  { operator: `^`, ratio: 1 },
  { operator: `/`, ratio: 1 },
  { operator: `-`, ratio: 1 },
  { operator: `+`, ratio: 3 },
  { operator: `*`, ratio: 3 },
] as const;

const getNewProblem = (selectedCategories: { categoryKey: string }[]) => {
  const includedOperators = operatorChances.filter((x) => selectedCategories.some((c) => c.categoryKey === x.operator));
  const choices = [] as typeof includedOperators;
  includedOperators.forEach((x) => {
    for (let i = 0; i < x.ratio; i++) {
      choices.push(x);
    }
  });
  const operator = choices[Math.floor(choices.length * Math.random())]?.operator ?? (`*` as const);

  if (operator === `^`) {
    const a = (Math.random() < 0.1 ? -1 : 1) * Math.floor(Math.random() * (MAX_MULTIPLICATION + 1));
    const b = Math.abs(a) > 3 ? 2 : Math.floor(Math.random() * (3 + 1));

    const problem = calculateProblem({ x: a, y: b, operator });
    return problem;
  }

  const a = (Math.random() < 0.1 ? -1 : 1) * Math.floor(Math.random() * (MAX_MULTIPLICATION + 1));
  const b = (Math.random() < 0.1 ? -1 : 1) * Math.floor(Math.random() * (MAX_MULTIPLICATION + 1));

  const problem = calculateProblem({ x: a, y: b, operator });
  return problem;
};

const getWrongChoices = (problem: MathProblemType) => {
  const { a, b, operator } = problem;
  const wrongChoices = [...new Array(7)]
    .map(() =>
      Math.floor(
        calculateProblem({
          x: Math.floor(a + (3 - Math.random() * 5)),
          y: operator === `^` && b === 0 ? 1 : operator === `^` ? b : Math.floor(b + (3 - Math.random() * 5)),
          operator,
        }).correctAnswerValue,
      ),
    )
    .filter((x) => isFinite(x));
  return new Set(wrongChoices.map((x) => x + ``));
};

const getReviewProblemSequence = (problem: MathProblemType): MathProblemType[] => {
  if (problem.operator === `^`) {
    return [
      calculateProblem({ x: problem.a, y: problem.a, operator: `*` }),
      calculateProblem({ x: problem.a, y: 2, operator: `^` }),
      problem,
    ];
  }

  if (problem.operator === `/`) {
    return [
      calculateProblem({ x: problem.a, y: problem.b, operator: `*` }),
      calculateProblem({ x: problem.b, y: problem.a, operator: `*` }),
      calculateProblem({ x: problem.a, y: problem.b, operator: `/` }),
      calculateProblem({ x: problem.b, y: problem.a, operator: `/` }),
    ];
  }

  const reviewProblems = [] as MathProblemType[];
  for (let i = problem.b - 2; i <= problem.b; i++) {
    if (i < -MAX_MULTIPLICATION) {
      continue;
    }
    if (i > MAX_MULTIPLICATION) {
      continue;
    }

    reviewProblems.push(calculateProblem({ x: problem.a, y: i, operator: problem.operator }));
  }
  return reviewProblems;
};

const evaluateAnswer = (problem: MathProblemType, answerRaw: undefined | string) => {
  const answer = parseInt(answerRaw + ``);

  const isCorrect = answer === problem.correctAnswerValue;

  if (isCorrect) {
    return {
      isCorrect,
    };
  }

  if (answerRaw === undefined) {
    return {
      isCorrect,
    };
  }

  if (isNaN(answer)) {
    return {
      isCorrect,
      responseMessage: `That's not even a number!`,
    };
  }

  return {
    isCorrect,
    responseMessage: `Incorrect ${answer}! ${problem.correctAnswerStatement}`,
  };
};

export const createMathSubject = (): StudySubject<MathProblemType, 'math'> => {
  return {
    subjectKey: `math`,
    subjectTitle: `Math`,
    getNewProblem,
    getWrongChoices,
    evaluateAnswer,
    getReviewProblemSequence,
    getCategories: () => mathCategories,
  };
};
