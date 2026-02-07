---
description: How to build the Community Forum feature with posts, comments, and voting
---

# Build Community Forum Workflow

This workflow implements a functional community forum for the WISEducation platform using the existing database schema and integrating with user authentication.

## Prerequisites
- Backend API running on `localhost:3005`
- Database with existing `post`, `comment`, `vote` tables from `apps/api/src/db/schema/post.ts`
- Frontend running with authentication via better-auth

## Workflow Steps

### 1. Enhance Backend API Routes
Extend `apps/api/src/routes/community.routes.ts` with:
- `POST /posts` - Create new post (existing, needs enhancement)
- `GET /posts` - Get all posts with author info (existing)
- `GET /posts/:id` - Get single post with comments
- `POST /posts/:id/comments` - Add comment to post
- `POST /posts/:id/vote` - Upvote/downvote a post
- `DELETE /posts/:id` - Delete own post

### 2. Enhance Backend Service
Update `apps/api/src/services/community.service.ts` with:
- `getPostById()` - Fetch single post with comments
- `createComment()` - Create comment on post
- `votePost()` - Handle upvote/downvote logic
- `deletePost()` - Delete post if owner

### 3. Update Frontend Community Page
Modify `apps/web/src/pages/Community.tsx`:
- Remove static mock data
- Add state for posts, loading, error
- Fetch posts from API on mount
- Implement create post form with API call
- Add comment functionality
- Add voting functionality
- Display user session data for logged-in user

### 4. Testing & Verification
- Start backend: `cd apps/api && npm run dev`
- Start frontend: `cd apps/web && npm run dev`
// turbo
- Run database migrations if needed: `npx drizzle-kit push:pg`
- Test in browser:
  1. Login to the application
  2. Navigate to Community section
  3. Create a new post
  4. Vote on posts
  5. Add comments

## File Structure

```
apps/
├── api/src/
│   ├── routes/community.routes.ts (modify)
│   ├── services/community.service.ts (modify)
│   └── db/schema/post.ts (existing - may need minor updates)
└── web/src/
    └── pages/Community.tsx (modify)
```

## Notes
- All posts are linked to authenticated users via `authorId`
- Voting prevents duplicate votes from same user
- Comments support nested replies via `parentId`
