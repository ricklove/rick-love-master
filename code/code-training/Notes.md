
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
    - [x] Save/Load Single Document Format
        - [x] JSON
        - [x] Storage
            - [x] TextArea
            - [x] Local Server / Local Files
    - [x] LessonData
        - [x] File Contents
        - [x] Lesson Focus
        - [x] Lesson Parts
    - [x] Display Lesson Preview
- [ ] Lessson Player
    - [ ] Lesson Navigator / Progress Display
    - [ ] Progress Storage
    - [ ] Display Lesson Steps
- [ ] Lesson Steps
    - [x] Construct Code
        - Type Code with auto complete (multiple-choice)
            - [x] Display Instructions
                - Title
                - Objective
                - Explanation
                - Task
            - [x] Type code
                - [x] Autocomplete Popdown
                - [x] Feedback Popup
    - [x] Understand Code
        - Fill in the blank prompts (press correct code word to answer)
    - [ ] Identify Mistakes
        - Correct re-arranged code (press mistake & type with autocomplete)
    - [ ] Preview Results
        - View Rendered Result
        - Change Experimental Code Alternatives and View Rendered Result
        - [ ] Render React with Create-React-App Template and App Component Switch

- [ ] Implement Code (local git)
    - [ ] Instructions to create a local git repo project
        - Create folder
        - Init git
        - Add Project Start (auto-commit & verify)
    - [ ] Instructions to commit code for a step
        - Commit
    - [ ] Review State
        - Verify all files are committed
            - `git status --short`
        - Show the lesson step (allow manually changing to another step)
        - Show a diff view between actual and lesson step
- [ ] Implement Code (GitHub Pull Requests)
    - [ ] Instructions to setup a real project
        - Create Git project (on Github)
        - Clone Git Repo
        - Add Project Start
        - Commit to master
        - Push
        - Grant System access to GitHub Repo
        - Verify Setup is complete (master is at the correct project state)
    - [ ] Instructions to make a Github Pull Request with completed code for a step
        - Create a feature branch
        - Commit
        - Push
        - Open Pull Request into master (Github)
    - [ ] Auto-Review Pull Request
        - Approve - if code is correct
        - Request Changes - if code is incorrect
            - Indicate Differences
    - [ ] Instructons to merge the PR into master (Github)
        - Once approved, merge the PR


---

# Build System (for State Renders)

node cli that runs a local express server to handle build operations

- load/save lessons
- build lesson
    - use a create react app template
    - replace src files
    - 