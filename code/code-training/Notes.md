
## Code Training

### Vocab

- LessonModule: The build package for a sequence of lessons
    - LessonData - All Data for each lesson
    - LessonRenders - The react build output for each lesson state 
- Lesson: Reaching a point in the project state (similar to a git commit with all the teaching material)
- LessonStep: A learning task executed by the student. A lesson

---

- Codey's Lab: https://www.youtube.com/watch?v=hKq1gmimBMY

### Modes (From Codey's Lab)

- Construct the code
    - Type
        - With Autocomplete
        - Given tokens to use
- Understand the code
    - Fill in the blank sentance which describes the purpose
    - Select the token in the code to fill in the blank
- Identify mistakes
    - Code is randomly modified
        - i.e. 2 tokens changed
    - Select mistake
    - Type correct token
- Preview Results
    - Restart (Set to time 0)
    - Code Experiments
        - Select code modification and see effect

### Lesson Step Items

- Code
    - Context (All Code)
    - Focus (Specific Code to Add/Modify)
- Title
- Objective
- Explanation
- Fill in the Blank Descriptions (should contain code tokens)
- Experiments
    - Find/Replace Pairs


# Tasks

- [ ] Lesson Editor
    - [ ] Save/Load Single Document Format
        - [x] JSON
        - [ ] Storage
            - [x] TextArea
            - [ ] Upload
            - [x] Local Server / Local Files
    - [x] LessonData
        - [x] File Contents
        - [x] Lesson Focus
        - [x] Lesson Parts
    - [x] Display Lesson Preview
- [ ] Lesson Steps
    - [x] Construct Code
        - Type Code with auto complete (multiple-choice)
            - [ ] Display Instructions
                - Title
                - Objective
                - Explanation
                - Task
            - [x] Type code
                - [x] Autocomplete Popdown
                - [x] Feedback Popup
    - [ ] Understand Code
        - Fill in the blank prompts (press correct code word to answer)
    - [ ] Identify Mistakes
        - Correct re-arranged code (press mistake & type with autocomplete)
    - [ ] Preview Results
        - View Rendered Result
        - Change Experimental Code Alternatives and View Rendered Result
        - [ ] Render React with Create-React-App Template and App Component Switch


---

# Build System (for State Renders)

node cli that runs a local express server to handle build operations

- load/save lessons
- build lesson
    - use a create react app template
    - replace src files
    - 