# MentorFlow Frontend

Welcome to the **MentorFlow Frontend** repository! MentorFlow is an educational mentoring platform designed to connect students with expert tutors. This project is built using modern web development tools and frameworks to ensure a highly responsive, performant, and accessible user experience.

## Tech Stack

This project leverages the following technologies:

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / Radix UI
- **Package Manager**: npm / yarn / pnpm / bun

## Features

- **Role-based Dashboards**: Custom interfaces for Admins, Tutors, and Students.
- **Booking Management**: Streamlined scheduling and session tracking.
- **User Management**: Admins can manage users, students, and tutors easily.
- **Responsive Design**: Mobile-first architecture ensuring great user experience across all devices.

## Getting Started

Follow these steps to run the application locally:

### Prerequisites

Make sure you have Node.js installed on your machine. We recommend using `nvm` to manage Node versions.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate into the project directory:
   ```bash
   cd mentorflow_fontend
   ```

3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

### Development Server

Start the local development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. You can start editing the page by modifying files in the `src/app` directory. The page auto-updates as you edit the files.

## Environment Variables

To run the project, you will need to set up your environment variables. Create a `.env.local` file in the root directory and configure it based on your backend and third-party API keys. 

Example:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Project Structure

- `src/app`: Contains the Next.js App Router structure, including pages, layouts, and API routes.
- `src/components`: Reusable UI components.
- `src/constants`: Application-wide constants and configurations.
- `public`: Static assets like images and icons.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
