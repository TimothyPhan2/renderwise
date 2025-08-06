# **11\. Coding Standards**

### **Core Principles**

* **Language & Runtimes:** All code will be written in **TypeScript 5.8.2** and run on **Node.js 22.15.1**.  
* **Style & Linting:** We will use **ESLint** and **Prettier** for automated code formatting and quality checks.  
* **Test Organization:** All test files will be co-located with the source code they are testing and will have a .test.ts or .spec.ts suffix.

### **Naming Conventions**

| Element | Convention | Example |
| :---- | :---- | :---- |
| **UI Components** | PascalCase | UserProfile.tsx |
| **React Hooks** | camelCase with 'use' prefix | useAuth.ts |
| **API Routes** | kebab-case folder/file names | /api/user-profile |
| **Database Tables** | camelCase | brandProfiles |
| **Functions/Variables** | camelCase | const userProfile \= ... |

### **Critical Rules for Development**

1. **Type Safety is Paramount:** Avoid using any unless absolutely necessary and justified with a comment.  
2. **Environment Variables:** Never access environment variables directly. All must be loaded into a centralized, type-safe configuration object.  
3. **API Calls:** Frontend components must not make direct fetch calls. All communication must go through a dedicated service layer.  
4. **Error Handling:** All API routes must use a standardized error handler.  
5. **State Management:** Never mutate state directly. All state updates must go through the defined actions in our Zustand store.
