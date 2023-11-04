# Up-Blog

## Description

Up-Blog is a user-friendly blogging platform for creating, managing, and sharing your blog posts.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Web Pages](#web-pages)
- [Screenshots](#screenshots)

## Features

- Create and publish blog posts
- Markdown support for blog content
- Tag and categorize your content
- User-friendly interface
- Simple setup and user authentication

## Installation

To set up Up-Blog locally, follow these installation steps:

### steps

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure environment variables.
4. Start the application: `npm start`

## Usage

Up-Blog simplifies the world of blogging. Use its intuitive web interface to effortlessly create, update, and showcase your blog posts. Share your thoughts with the world and enjoy a seamless blogging experience.

## API Routes

Up-Blog offers a set of API routes for managing blogs and users:

- **POST /api/users/signup**: For signing up a user
- **POST /api/users/activate**:  To activate user account
- **POST /api/users/resend-activation**: To request for new activation mail/token
- **POST /api/users/forgot-password**: To request for reset-password mail
- **POST /api/users/reset-password**: To reset password
- **POST /api/auth/login**: To login

- **GET /api/blogs**: Retrieve a list of blogs.
- **GET /api/blogs/slugOrId**: Retrieve a single blog by its ID or Slug.
- **POST /api/blog**: Create a  new blog.
- **PUT /api/blog/id**: Update an existing blog.
- **DELETE /api/blog/id**: To delete a blog

For detailed documentation of the API routes, please visit the [Up-Blog Documentation](https://documenter.getpostman.com/view/23280484/2s9YRGyUgX).

## Web Routes

Still under Construction, not 100% perfect

The WebSite is located at [Up-Blog Web](https://up-blog.onrender.com)

## ERD
![ERD-Diagram](https://github.com/emeralddd123/Blog/assets/93847541/c47a1074-7726-4f4f-968f-ade2119250b8)

## Screenshots

![image](https://github.com/emeralddd123/Blog/assets/93847541/d1908b3e-d150-4cc3-be47-7a4aa20c3212)


![image](https://github.com/emeralddd123/Blog/assets/93847541/80c8219f-dc5c-4800-9357-b7200d077799)

![image](https://github.com/emeralddd123/Blog/assets/93847541/460e9c54-d8e8-4e49-9e31-434090d1c1dc)

![image](https://github.com/emeralddd123/Blog/assets/93847541/a4d27702-e8f3-4ffd-80f6-a62c702d8c66)



