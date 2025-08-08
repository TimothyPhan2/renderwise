# Enhanced Development Workflow

This is a simple step-by-step guide to help you efficiently manage your development workflow using the BMad Method with automatic Git branching. Refer to the **[<ins>User Guide</ins>](user-guide.md)** for any scenario that is not covered here.

## Git Branching Strategy

The dev agent now automatically creates feature branches for each story:
- Branch naming convention: `feature/story-{id}-{title-slug}`
- One branch per story for clean isolation
- Automatic branch creation when starting story development
- Built-in safety checks for uncommitted changes

## Story Creation (Scrum Master)

1. **Start new chat/conversation**
2. **Load SM agent**
3. **Execute**: `*draft` (runs create-next-story task)
4. **Review generated story** in `docs/stories/`
5. **Update status**: Change from "Draft" to "Approved"

## Story Implementation (Developer)

1. **Start new chat/conversation**
2. **Load Dev agent**
3. **Execute**: `*develop-story {selected-story}`
   - Automatically checks git status
   - Creates and switches to feature branch
   - Pushes branch to remote with tracking
   - Implements story tasks
4. **Complete story**: Use `*finish-story` to:
   - Commit all changes
   - Push to remote
   - Get PR creation instructions

## Story Review (Quality Assurance)

1. **Start new chat/conversation**
2. **Load QA agent**
3. **Execute**: `*review {selected-story}` (runs review-story task)
4. **Review generated report** in `{selected-story}`

## Pull Request Workflow

1. **Developer completes story** on feature branch
2. **Push feature branch** to remote (automatic with `*finish-story`)
3. **Create Pull Request** using GitHub CLI or web interface:
   ```bash
   gh pr create --title "Story {id}: {title}" --body "Implements story requirements..."
   ```
4. **Review and merge** to main branch
5. **Delete feature branch** after merge (optional)

## Repeat Until Complete

- **SM**: Create next story → Review → Approve
- **Dev**: 
  - Start story → Auto-create feature branch
  - Implement → Test → Complete
  - Push branch → Create PR
- **QA**: Review story on feature branch → Approve PR
- **Merge**: PR to main after approval
- **Continue**: Until all features implemented

## Branch Management Commands

The enhanced dev agent provides these branch management commands:
- `*check-branch` - Display current branch and status
- `*list-branches` - List all local and remote branches  
- `*develop-story` - Auto-creates feature branch
- `*finish-story` - Commits, pushes, and provides PR instructions
