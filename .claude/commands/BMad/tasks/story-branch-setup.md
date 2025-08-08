# story-branch-setup

Task for setting up a feature branch for story development.

## Task Definition

```yaml
task:
  name: story-branch-setup
  description: Set up a feature branch for story development with proper Git flow
  type: development
  elicit: false
  
steps:
  1_check_status:
    description: Check current Git status and branch
    commands:
      - git status
      - git branch --show-current
    validation:
      - Ensure working tree is clean
      - If uncommitted changes exist, prompt user to commit or stash
      
  2_ensure_main:
    description: Ensure we're on the main/master branch
    commands:
      - git checkout main || git checkout master
      - git pull origin main || git pull origin master
    validation:
      - Confirm on main/master branch
      - Confirm up-to-date with remote
      
  3_extract_story_info:
    description: Extract story ID and title from story file
    process:
      - Read story file header
      - Extract ID (e.g., "1.1")
      - Extract title and create slug (lowercase, hyphenated)
    example:
      - Story: "1.1 - Implement User Authentication"
      - Branch: "feature/story-1.1-implement-user-authentication"
      
  4_create_branch:
    description: Create and checkout feature branch
    commands:
      - git checkout -b feature/story-{id}-{slug}
    validation:
      - Confirm branch created
      - Confirm switched to new branch
      
  5_push_branch:
    description: Push branch to remote with tracking
    commands:
      - git push -u origin feature/story-{id}-{slug}
    validation:
      - Confirm branch pushed to remote
      - Confirm tracking set up
      
  6_confirm:
    description: Confirm branch setup complete
    output:
      - Display current branch name
      - Display remote tracking status
      - Ready to begin story implementation

error_handling:
  uncommitted_changes:
    - Prompt: "You have uncommitted changes. Please commit or stash them before proceeding."
    - Options: 
      - Commit changes
      - Stash changes
      - Abort
  branch_exists:
    - Prompt: "Branch already exists. Would you like to:"
    - Options:
      - Switch to existing branch
      - Create new branch with suffix
      - Abort
  merge_conflicts:
    - Prompt: "Merge conflicts detected when pulling latest changes."
    - Action: Guide user through conflict resolution

best_practices:
  - Always start from clean main/master branch
  - Pull latest changes before creating branch
  - Use descriptive branch names following convention
  - Push branch immediately after creation for visibility
  - One branch per story for clean separation
```

## Usage

This task is automatically executed by the dev agent when running `*develop-story` command. It can also be run independently if needed.

## Integration

This task integrates with:
- Dev agent's develop-story workflow
- Git flow best practices
- CI/CD pipeline triggers
- Pull request creation workflow